import { Component } from './Component'
import { diff } from './diff'
import { h, fragment } from './hyperscript'
import { VNode } from './VNode'
import { buildNodeFragment } from './Node'

type Redraw = () => void
type GlobalRef = {
  redraw: Redraw
}

const rAF = typeof requestAnimationFrame === 'undefined' ? (fn: Function) => fn() : requestAnimationFrame

const mount = (root: Element) => (component: Component<any>): Redraw => {

  let oldVNode: VNode = fragment()

  // redraw
  const redraw = () => rAF(() => {
    const vnode = h(component)
    diff({ redraw }, oldVNode, vnode)
    oldVNode = vnode
  })


  // first drawn
  rAF(() => {
    const vnode = h(component)

    // we start the old vnode as an empty fragment
    buildNodeFragment({ redraw }, oldVNode)
    oldVNode.parent = root

    root.textContent = ''

    diff({ redraw }, oldVNode, vnode)
    oldVNode = vnode
  })

  return redraw

}

export {
  GlobalRef,
  mount
}
