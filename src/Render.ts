import { Component, ComponentReturn } from './Component'
import { h } from './Hyperscript'
import { VNode, Type as VNodeType } from './VNode'


type Redraw = () => void

// FIXME it would be good to accept document as a param
// so it would be possible to use something like jsdom
const $doc: Document = window.document

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
  return buildNode(redraw, vnode.children[0])
}

const buildNodeFragment = (redraw: Redraw, vnode: VNode): Node => {
  const fragment = $doc.createDocumentFragment()
  vnode.children.forEach(vn => fragment.appendChild(buildNode(redraw, vn)))
  return fragment
}

const buildNodeRaw = (redraw: Redraw, vnode: VNode): Node => {
  return $doc.createDocumentFragment()
}

const buildNodeTag = (redraw: Redraw, vnode: VNode): Node => {
  vnode.dom = $doc.createElement(<string>vnode.item)

  // set attrs
  Object.entries(vnode.attrs).forEach(([k, v]) => { 
    if (k.slice(0, 2) === 'on') (<Element>vnode.dom).addEventListener(k.slice(2), v)
    else (<Element>vnode.dom).setAttribute(k, v) 
  })

  // children
  vnode.children.forEach(vn => vnode.dom?.appendChild(buildNode(redraw, vn)))

  return vnode.dom
}

const buildNodeText = (redraw: Redraw, vnode: VNode): Node => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  return vnode.dom
}

// parent will be useful when the old vnode is undefined but the cur vnode is defined (insert operation)
const diff = (redraw: Redraw, old?: VNode, cur?: VNode, parent?: Node): void => {

  // just the old - remove
  if(old && !cur) {}

  // just the cur - insert
  else if(!old && cur) {}

  // from now on, both
  else if(old && cur) {

    if(old.type !== cur.type) {}
    else {
      // Component
      if(cur.type === VNodeType.Component) {

        // component is the same, so keep the instance
        if(old.item !== cur.item) cur.instance = (<Component<any>>cur.item)(cur.attrs, redraw)
        else cur.instance = old.instance

        cur.children = cur.instance ? [cur.instance?.view({ attrs: cur.attrs, children: cur.children })] : []
        for(let i=0; i < old.children.length; i++) diff(redraw, old.children[i], cur.children[i])
      }

      // Fragment
      else if(cur.type === VNodeType.Fragment) {
        for(let i=0; i < old.children.length; i++) diff(redraw, old.children[i], cur.children[i])
      }

      // Tag
      else if(cur.type === VNodeType.Tag) {
        //(<Element>old.dom).replaceWith(buildNodeText(cur))
        for(let i=0; i < old.children.length; i++) diff(redraw, old.children[i], cur.children[i])
      }

      // Text
      else if(cur.type === VNodeType.Text) {
        ;(<Element>old.dom).textContent = <string>cur.item
        cur.dom = old.dom
      }
    }

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
