import { Component } from './Component'
import { Redraw } from './mount'
import { VNode, Type as VNodeType } from './VNode'

enum Type {
  Element = 1,
  Attribute = 2,
  Text = 3,
  CDataSection = 4,
  ProcessingInstruction = 7,
  Comment = 8,
  Document = 9,
  DocumentType = 10,
  Fragment = 11
}

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
  vnode.node = buildNode(redraw, vnode.children[0])
  return vnode.node
}

const buildNodeFragment = (redraw: Redraw, vnode: VNode): Node => {
  vnode.node = $doc.createDocumentFragment()
  for(let i=0; i < vnode.children.length; i++) {
    vnode.node.appendChild(buildNode(redraw, vnode.children[i]))
    vnode.children[i].parent = vnode.node
  }
  return vnode.node
}

const buildNodeRaw = (redraw: Redraw, vnode: VNode): Node => {
  return $doc.createDocumentFragment()
}

const buildNodeTag = (redraw: Redraw, vnode: VNode): Node => {
  vnode.node = $doc.createElement(<string>vnode.item)

  // set attrs
  setElementAttrs(<Element>vnode.node, vnode.attrs)

  // children
  for(let i=0; i < vnode.children.length; i++) {
    vnode.node.appendChild(buildNode(redraw, vnode.children[i]))
    vnode.children[i].parent = vnode.node
  }
  return <Element>vnode.node
}

const buildNodeText = (redraw: Redraw, vnode: VNode): Node => {
  vnode.node = $doc.createTextNode(<string>vnode.item)
  return vnode.node
}

export { 
  Type,
  buildNode,
  buildNodeFragment,
  buildNodeTag,
  setElementAttrs
}
