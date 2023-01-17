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

const buildNode = (redraw: Redraw, vnode: VNode): Node | Element => {
  const dispatcher = {
    [VNodeType.Component]: buildNodeComponent,
    [VNodeType.Fragment]: buildNodeFragment,
    [VNodeType.Raw]: buildNodeRaw,
    [VNodeType.Tag]: buildNodeTag,
    [VNodeType.Text]: buildNodeText
  }
  return dispatcher[vnode.type](redraw, vnode)
}

const buildNodeComponent = (redraw: Redraw, vnode: VNode): Node | Element => {
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

const buildNodeTag = (redraw: Redraw, vnode: VNode): Element => {
  vnode.dom = $doc.createElement(<string>vnode.item)

  // set attrs
  setElementAttrs(<Element>vnode.dom, vnode.attrs)

  // children
  for(let i=0; i < vnode.children.length; i++) vnode.dom?.appendChild(buildNode(redraw, vnode.children[i]))

  return <Element>vnode.dom
}

const buildNodeText = (redraw: Redraw, vnode: VNode): Node => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  return vnode.dom
}

const diff = (redraw: Redraw, old: VNode, cur: VNode): void => {

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
        // if old attrs do not exist in the cur, delete them
        const oldAttrs = Object.keys(old.attrs)
        type OldAttrsKey = keyof typeof old.attrs
        for(let i = 0; i < oldAttrs.length; i++) {
          if(oldAttrs[i].slice(0, 2) === 'on') { ;(<Element>old.dom).removeEventListener(oldAttrs[i].slice(2), old.attrs[oldAttrs[i] as OldAttrsKey]) }
          else (<Element>old.dom).removeAttribute(oldAttrs[i])
        }
        // create all attrs from cur
        setElementAttrs(<Element>old.dom, cur.attrs)
      }
    }

    // for vnodes that may have children ( components, fragments and tags )
    // diff the children and keep the dom reference
    const toDiff = Math.min(old.children.length, cur.children.length)

    // cur has more children, so insert them
    if(toDiff < cur.children.length) {
      for(let i = toDiff; i < cur.children.length; i++) old.dom?.parentNode?.appendChild(buildNode(redraw, cur.children[i]))
    }
    // old has more children, so remove them
    else if(toDiff < old.children.length) {
      for(let i = toDiff; i < old.children.length; i++) (<Element>old.children[i].dom).remove()
    }

    // diff the number of children in common
    for(let i=0; i < toDiff; i++) diff(redraw, old.children[i], cur.children[i])
    cur.dom = old.dom

  }

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
