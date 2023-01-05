import { ComponentReturn } from './Component'
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
  item: ComponentReturn | string
  attrs: object
  children: Array<VNode>
  dom?: Node
}

const normalize = (node: any): VNode => {
  if(node.__sv__) return node
  if(Array.isArray(node)) return pure({ __sv__: true, type: Type.Fragment, item: '', attrs: pure(), children: normalizeChildren(node) })
  return pure({ __sv__: true, type: Type.Text, item: String(node), attrs: pure(), children: [] })
}

const normalizeChildren = (nodes: Array<any>): Array<VNode> => nodes.map(normalize)

export {
  normalizeChildren,
  Type,
  VNode
}
