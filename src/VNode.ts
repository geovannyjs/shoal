import { Component, ComponentReturn } from './Component'
import { pure } from './Object'


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
  if(Array.isArray(node)) return pure({ __sv__: true, type: Type.Fragment, item: '', attrs: pure(), children: normalizeChildren(node) })
  return pure({ __sv__: true, type: Type.Text, item: String(node), attrs: pure(), children: [] })
}

const normalizeChildren = (nodes: Array<any>): Array<VNode> => {
  let normalized: Array<VNode> = []
  for(let i=0; i < nodes.length; i++) {
    if(nodes[i] != null) normalized[i] = normalize(nodes[i])
  }
  return normalized
}

export {
  normalizeChildren,
  Type,
  VNode
}
