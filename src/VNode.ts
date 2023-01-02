import { Component } from './Component'


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
  key?: string | number
  attrs: Object
  children: Array<VNode>
}

const normalize = (node: any): VNode => {
  if(node.__sv__) return node
  if(Array.isArray(node)) return { __sv__: true, type: Type.Fragment, item: '', attrs: {}, children: normalizeChildren(node) }
  return { __sv__: true, type: Type.Text, item: String(node), attrs: {}, children: [] }
}

const normalizeChildren = (nodes: Array<any>): Array<VNode> => {
  return nodes.map(normalize)
}

export {
  normalizeChildren,
  Type,
  VNode
}
