import { VNode } from './VNode'


type Attrs = {
  class?: string
} & Object

type ComponentLifeCycleMethods = {
  beforeRemove: () => any
  beforeUpdate: () => any
  ready: () => any
  remove: () => any
  update: () => any
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
