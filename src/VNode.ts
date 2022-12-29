import { Component } from './Component'


enum Type {
  Component = 0,
  Fragment,
  Raw,
  Tag,
  Text
}

type VNode = {
  __SVN__: boolean
  type: Type
  item?: Component | string
  key?: string | number
  attrs?: Object
  children: Array<VNode>
}

export {
  VNode,
  Type
}
