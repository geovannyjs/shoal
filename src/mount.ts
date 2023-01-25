import { Component } from './Component'
import { h } from './hyperscript'
import { VNode, Type as VNodeType } from './VNode'
import { Type as NodeType, buildNode, buildNodeTag } from './Node'


type Redraw = () => void

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

const diff = (redraw: Redraw, old: VNode, cur: VNode, index: number = 0): void => {

  if(old.type !== cur.type) {
    if(old.node?.nodeType === NodeType.Fragment) {
      let oldChildren = Array.from(<Array<ChildNode>><unknown>old.parent?.childNodes)
      old.parent && ( old.parent.textContent = '' )
      let curNode = oldChildren.slice(0, index).concat(<ChildNode>buildNode(redraw, cur), oldChildren.slice(index + old.children.length + 1))
      for(let i = 0; i < curNode.length; i++) old.parent?.appendChild(curNode[i])
    }
    else {
      ;(<Element>old.node).replaceWith(buildNode(redraw, cur))
    }
    cur.parent = old.parent
    return
  }
  else {
    // Text
    if(cur.type === VNodeType.Text) {
      ;(<Element>old.node).textContent = <string>cur.item
      cur.node = old.node
      cur.parent = old.parent
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
        (<Element>old.node).replaceWith(buildNodeTag(redraw, cur))
        return
      }
      // diff attrs
      else {
        // if old attrs do not exist in the cur, delete them
        const oldAttrs = Object.keys(old.attrs)
        type OldAttrsKey = keyof typeof old.attrs
        for(let i = 0; i < oldAttrs.length; i++) {
          if(oldAttrs[i].slice(0, 2) === 'on') { ;(<Element>old.node).removeEventListener(oldAttrs[i].slice(2), old.attrs[oldAttrs[i] as OldAttrsKey]) }
          else (<Element>old.node).removeAttribute(oldAttrs[i])
        }
        // create all attrs from cur
        setElementAttrs(<Element>old.node, cur.attrs)
      }
    }

    // for vnodes that may have children ( components, fragments and tags )
    // diff the children and keep the dom reference
    const toDiff = Math.min(old.children.length, cur.children.length)

    // cur has more children, so insert them
    if(toDiff < cur.children.length) {
      for(let i = toDiff; i < cur.children.length; i++) {
        old.parent?.appendChild(buildNode(redraw, cur.children[i]))
        cur.children[i].parent = old.node
      }
    }
    // old has more children, so remove them
    else if(toDiff < old.children.length) {
      for(let i = toDiff; i < old.children.length; i++) {
        if(old.node?.nodeType === NodeType.Fragment) old.parent?.removeChild(<Node>old.children[i].node)
        else old.node?.removeChild(<Node>old.children[i].node)
      }
    }

    // diff the number of children in common
    for(let i=0; i < toDiff; i++) diff(redraw, old.children[i], cur.children[i], i)
    cur.node = old.node
    cur.parent = old.parent

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
    vnode.parent = root
    oldVNode = vnode
  })

  return redraw

}

export {
  Redraw,
  mount
}
