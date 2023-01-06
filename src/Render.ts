import { VNode, Type as VNodeType } from './VNode'


type NodeVNode = Node & { vnode?: VNode }

// FIXME it would be good to accept document as a param
// so it would be possible to use something like jsdom
const $doc: Document = window.document

/*
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

const createNodeTag = (parent: Node, vnode: VNode):void => {
  vnode.dom = $doc.createElement(<string>vnode.item)

  // set attrs
  Object.entries(vnode.attrs).forEach(([k, v]) => (<HTMLElement>vnode.dom).setAttribute(k, v))

  insertDOM(parent, vnode.dom)
  createNodes(vnode.dom, vnode.children)
}

const createNodeText = (parent: Node, vnode: VNode):void => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  insertDOM(parent, vnode.dom)
}

const updateNodes = (parent: Node, old: Array<VNode>, cur: Array<VNode>): void => {
  if (old === cur) return
  else if (old.length === 0) createNodes(parent, cur)
}

const insertDOM = (parent: Node, dom: Node): void => { parent.appendChild(dom) }
*/

const buildNode = (vnode: VNode):Node => {
  const dispatcher = {
    [VNodeType.Component]: buildNodeComponent,
    [VNodeType.Fragment]: buildNodeFragment,
    [VNodeType.Raw]: buildNodeRaw,
    [VNodeType.Tag]: buildNodeTag,
    [VNodeType.Text]: buildNodeText
  }
  return dispatcher[vnode.type](vnode)
}

const buildNodeComponent = (vnode: VNode):Node => {
  return buildNode(vnode.children[0])
}

const buildNodeFragment = (vnode: VNode):Node => {
  const fragment = $doc.createDocumentFragment()
  vnode.children.forEach(vn => fragment.appendChild(buildNode(vn)))
  return fragment
}

const buildNodeRaw = (vnode: VNode):Node => {
  return $doc.createDocumentFragment()
}

const buildNodeTag = (vnode: VNode):Node => {
  vnode.dom = $doc.createElement(<string>vnode.item)

  // set attrs
  Object.entries(vnode.attrs).forEach(([k, v]) => (<HTMLElement>vnode.dom).setAttribute(k, v))

  // children
  vnode.children.forEach(vn => vnode.dom?.appendChild(buildNode(vn)))

  return vnode.dom
}

const buildNodeText = (vnode: VNode):Node => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  return vnode.dom
}

const render = (root: Node, vnode: VNode) => {

  // first time rendering
  if ((<NodeVNode>root).vnode == undefined) {
    root.textContent = ''
    root.appendChild(buildNode(vnode))
  }

  //updateNodes(root, (<NodeVNode>root).vnode, cur)
  ;(<NodeVNode>root).vnode = vnode

}

export {
  render
}
