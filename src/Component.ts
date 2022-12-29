import { VNode } from './VNode'


type Attrs = {
  class?: string
} & Object

type ComponentLifeCycleMethods = {
  beforeRemove: () => any
  beforeUpdate: () => any
  created: () => any
  removed: () => any
  updated: () => any
}

type ComponentViewMethod = {
  view: () => VNode
}

type Component = (attrs: Attrs) => ComponentLifeCycleMethods & ComponentViewMethod

export {
  Attrs,
  Component,
  ComponentLifeCycleMethods,
  ComponentViewMethod
}
