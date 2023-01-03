import { Component } from './Component'
import { hyperscript as h } from './Hyperscript'
import { VNode, Type as VNodeType } from './VNode'


type HTMLElementVNodes = HTMLElement & { vnodes: Array<VNode> }

const createNodes = (parent: HTMLElementVNodes, cur: Array<VNode>):void => cur.forEach(vnode => vnode && createNode(parent, vnode))

const createNode = (parent: HTMLElementVNodes, vnode: VNode):void => {
  const dispatcher = {
    [VNodeType.Component]: createNodeComponent,
    [VNodeType.Fragment]: createNodeFragment,
    [VNodeType.Raw]: createNodeRaw,
    [VNodeType.Tag]: createNodeTag,
    [VNodeType.Text]: createNodeText
  }
  dispatcher[vnode.type](parent, vnode)
}

const createNodeComponent = (parent: HTMLElementVNodes, vnode: VNode):void => {}

const createNodeFragment = (parent: HTMLElementVNodes, vnode: VNode):void => {}

const createNodeRaw = (parent: HTMLElementVNodes, vnode: VNode):void => {}

const createNodeTag = (parent: HTMLElementVNodes, vnode: VNode):void => {}

const createNodeText = (parent: HTMLElementVNodes, vnode: VNode):void => {}

const updateNodes = (parent: HTMLElementVNodes, old: Array<VNode>, cur: Array<VNode>): void => {
  if (old === cur) return
  else if (old.length === 0) createNodes(parent, cur)
}

const render = (root: HTMLElement, component: Component<any>) => {

  // First time rendering into a node clears it out
  if ((<HTMLElementVNodes>root).vnodes == null) {
    ;(<HTMLElementVNodes>root).vnodes = []
    root.textContent = ''
  }

  const cur: Array<VNode> = [h(component)]
  updateNodes(<HTMLElementVNodes>root, (<HTMLElementVNodes>root).vnodes, cur)
  ;(<HTMLElementVNodes>root).vnodes = cur

}

export {
  render
}
