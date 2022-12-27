import { Component } from './Component'


enum Type {
  Component = 0,
  Element,
  Fragment,
  Tag,
  Text
}

type VNode = {
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
