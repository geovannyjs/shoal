import { Component } from './Component'


enum Type {
  Component = 0,
  Fragment,
  Raw,
  Tag,
  Text
}

type VNode = {
  __shoalVNode__: boolean
  type: Type
  item: Component | string
  key?: string | number
  attrs: Object
  children: Array<VNode>
}

const normalize = (node: any): VNode => {
  if(Array.isArray(node)) return { __shoalVNode__: true, type: Type.Fragment, item: '', attrs: {}, children: normalizeChildren(node) }
  if(node.__shoalVNode__) return node
  return { __shoalVNode__: true, type: Type.Text, item: String(node), attrs: {}, children: [] }
}

const normalizeChildren = (nodes: Array<any>): Array<VNode> => {
  return nodes.map(normalize)
}

export {
  normalizeChildren,
  Type,
  VNode
}
