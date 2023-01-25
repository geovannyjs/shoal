import { Component } from './Component'
import { diff } from './diff'
import { h } from './hyperscript'
import { VNode } from './VNode'
import { buildNode } from './Node'


type Redraw = () => void

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
