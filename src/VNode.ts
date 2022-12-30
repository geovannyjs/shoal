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

const normalize = (): VNode => {}

const normalizeChildren = (): Array<VNode> => {}

export {
  normalizeChildren,
  Type,
  VNode
}
