import { Component } from './Component'
import { hyperscript as h } from './Hyperscript'
import { VNode } from './VNode'


type HTMLElementVNodes = HTMLElement & { vnodes: Array<VNode> }

const updateNodes = (parent: HTMLElementVNodes, old: Array<VNode>, cur: Array<VNode>): void => {
  if (old === cur) return
}

const render = (root: HTMLElement, component: Component<any>) => {

  const dom: HTMLElementVNodes = <HTMLElementVNodes>root

  // First time rendering into a node clears it out
  if (dom.vnodes == null) {
    dom.vnodes = []
    dom.textContent = ''
  }

  const cur: Array<VNode> = [h(component)]
  updateNodes(dom, dom.vnodes, cur)
  dom.vnodes = cur

}

export {
  render
}
