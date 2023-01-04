import { VNode, Type as VNodeType } from './VNode'


type NodeVNodes = Node & { vnodes: Array<VNode> }

// FIXME it would be good to accept document as a param
// so it would be possible to use something like jsdom
const $doc: Document = window.document

const createNodes = (parent: Node, cur: Array<VNode>):void => cur.forEach(vnode => vnode && createNode(parent, vnode))

const createNode = (parent: Node, vnode: VNode):void => {
  const dispatcher = {
    [VNodeType.Component]: createNodeComponent,
    [VNodeType.Fragment]: createNodeFragment,
    [VNodeType.Raw]: createNodeRaw,
    [VNodeType.Tag]: createNodeTag,
    [VNodeType.Text]: createNodeText
  }
  dispatcher[vnode.type](parent, vnode)
}

const createNodeComponent = (parent: Node, vnode: VNode):void => {
  createNode(parent, vnode.children[0])
}

const createNodeFragment = (parent: Node, vnode: VNode):void => {
  const fragment = $doc.createDocumentFragment()
  createNodes(fragment, vnode.children)
  insertDOM(parent, fragment)
}

const createNodeRaw = (parent: Node, vnode: VNode):void => {}

const createNodeTag = (parent: Node, vnode: VNode):void => {}

const createNodeText = (parent: Node, vnode: VNode):void => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  insertDOM(parent, vnode.dom)
}

const updateNodes = (parent: Node, old: Array<VNode>, cur: Array<VNode>): void => {
  if (old === cur) return
  else if (old.length === 0) createNodes(parent, cur)
}

const insertDOM = (parent: Node, dom: Node): void => { parent.appendChild(dom) }

const render = (root: Node, vnode: VNode) => {

  // First time rendering into a node clears it out
  if ((<NodeVNodes>root).vnodes == null) {
    ;(<NodeVNodes>root).vnodes = []
    root.textContent = ''
  }

  const cur: Array<VNode> = [vnode]
  updateNodes(root, (<NodeVNodes>root).vnodes, cur)
  ;(<NodeVNodes>root).vnodes = cur

}

export {
  render
}
