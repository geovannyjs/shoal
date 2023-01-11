import { Component, ComponentReturn } from './Component'


enum Type {
  Component = 0,
  Fragment,
  Raw,
  Tag,
  Text
}

type VNode = {
  __sv__: boolean
  type: Type
  item: Component<any> | string
  instance?: ComponentReturn
  attrs: object
  children: Array<VNode>
  dom?: Node
}

const normalize = (node: any): VNode => {
  if(node.__sv__) return node
  if(Array.isArray(node)) return { __sv__: true, type: Type.Fragment, item: '', attrs: {}, children: normalizeChildren(node) }
  return { __sv__: true, type: Type.Text, item: String(node), attrs: {}, children: [] }
}

const normalizeChildren = (nodes: Array<any>): Array<VNode> => {
  let normalized: Array<VNode> = []
  for(let i=0; i < nodes.length; i++) {
    if(nodes[i] != null) normalized.push(normalize(nodes[i]))
  }
  return normalized
}

export {
  normalizeChildren,
  Type,
  VNode
}
