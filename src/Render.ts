import { Component } from './Component'
import { h } from './Hyperscript'
import { VNode, Type as VNodeType } from './VNode'


type Redraw = () => void

// FIXME it would be good to accept document as a param
// so it would be possible to use something like jsdom
const $doc: Document = window.document

const setElementAttrs = (el: Element, attrs: object):void => {

  type ObjectKey = keyof typeof attrs
  const keys = Object.keys(attrs)
  for(let i=0; i < keys.length; i++) {
    let k = keys[i]
    let v = attrs[k as ObjectKey]
    if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v) 
  }

}

const buildNode = (redraw: Redraw, vnode: VNode): Node => {
  const dispatcher = {
    [VNodeType.Component]: buildNodeComponent,
    [VNodeType.Fragment]: buildNodeFragment,
    [VNodeType.Raw]: buildNodeRaw,
    [VNodeType.Tag]: buildNodeTag,
    [VNodeType.Text]: buildNodeText
  }
  return dispatcher[vnode.type](redraw, vnode)
}

const buildNodeComponent = (redraw: Redraw, vnode: VNode): Node => {
  vnode.instance = (<Component<any>>vnode.item)(vnode.attrs, redraw)
  vnode.children = [vnode.instance.view({ attrs: vnode.attrs, children: vnode.children })]
  vnode.dom = buildNode(redraw, vnode.children[0])
  return vnode.dom
}

const buildNodeFragment = (redraw: Redraw, vnode: VNode): Node => {
  vnode.dom = $doc.createDocumentFragment()
  for(let i=0; i < vnode.children.length; i++) vnode.dom.appendChild(buildNode(redraw, vnode.children[i]))
  return vnode.dom
}

const buildNodeRaw = (redraw: Redraw, vnode: VNode): Node => {
  return $doc.createDocumentFragment()
}

const buildNodeTag = (redraw: Redraw, vnode: VNode): Node => {
  vnode.dom = $doc.createElement(<string>vnode.item)

  // set attrs
  setElementAttrs(<Element>vnode.dom, vnode.attrs)

  // children
  for(let i=0; i < vnode.children.length; i++) vnode.dom?.appendChild(buildNode(redraw, vnode.children[i]))

  return vnode.dom
}

const buildNodeText = (redraw: Redraw, vnode: VNode): Node => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  return vnode.dom
}

// parent will be useful when the old vnode is undefined but the cur vnode is defined (insert operation)
const diff = (redraw: Redraw, old?: VNode, cur?: VNode, parent?: Node): void => {

  // from now on, both
  if(old && cur) {

    if(old.type !== cur.type) {
      ;(<Element>old.dom).replaceWith(buildNode(redraw, cur))
      return
    }
    else {
      // Text
      if(cur.type === VNodeType.Text) {
        ;(<Element>old.dom).textContent = <string>cur.item
        cur.dom = old.dom
        return
      }

      // Component
      else if(cur.type === VNodeType.Component) {

        // component is different, so create a new instance
        if(old.item !== cur.item) cur.instance = (<Component<any>>cur.item)(cur.attrs, redraw)
        else cur.instance = old.instance

        cur.children = cur.instance ? [cur.instance?.view({ attrs: cur.attrs, children: cur.children })] : []
      }

      // Tag
      else if(cur.type === VNodeType.Tag) {
        if(old.item !== cur.item) { 
          (<Element>old.dom).replaceWith(buildNodeTag(redraw, cur))
          return
        }
        // diff attrs
        else {
          // create all attrs from cur
          setElementAttrs(<Element>old.dom, cur.attrs)
          // if old attrs do not exist in the cur, delete them
        }
      }

      // for vnodes that may have children ( components, fragments and tags )
      // diff the children and keep the dom reference
      for(let i=0; i < Math.max(old.children.length, cur.children.length); i++) diff(redraw, old.children[i], cur.children[i], old.dom)
      cur.dom = old.dom

    }

  }

  // just the old - remove
  else if(old && !cur) (<Element>old.dom).remove()

  // just the cur - insert
  else if(cur) (<Element>parent).appendChild(buildNode(redraw, cur))

}

const rAF = typeof requestAnimationFrame === 'undefined' ? (fn: Function) => fn() : requestAnimationFrame

const mount = (root: Element) => (component: Component<any>): Redraw => {

  let oldVNode: VNode

  // redraw
  const redraw = () => rAF(() => {
    const vnode = h(component)
    diff(redraw, oldVNode, vnode)
    oldVNode = vnode
  })


  // first drawn
  rAF(() => {
    const vnode = h(component)
    root.textContent = ''
    root.appendChild(buildNode(redraw, vnode))
    oldVNode = vnode
  })

  return redraw

}

export {
  mount
}
