import { VNode } from './VNode'


type Attrs<T extends object> = {
  class?: string
} & T

type ComponentLifeCycleMethods = {
  beforeRemove?: () => any
  beforeUpdate?: () => any
  ready?: () => any
  remove?: () => any
  update?: () => any
}

type ComponentViewMethod = {
  view: () => VNode
}

type Component<T extends Object> = (attrs: Attrs<T>) => ComponentLifeCycleMethods & ComponentViewMethod

export {
  Attrs,
  Component,
  ComponentLifeCycleMethods,
  ComponentViewMethod
}
