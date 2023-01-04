import { VNode } from './VNode'


type Attrs<T extends object> = T

type ComponentLifeCycleMethods = {
  afterCreate?: () => any
  afterRemove?: () => any
  afterUpdate?: () => any
  beforeRemove?: () => boolean
  beforeUpdate?: () => boolean
}

type ComponentViewMethod = {
  view: () => VNode
}

type ComponentReturn = ComponentLifeCycleMethods & ComponentViewMethod

type Component<T extends object> = (attrs: Attrs<T>) => ComponentReturn

export {
  Attrs,
  Component,
  ComponentLifeCycleMethods,
  ComponentReturn,
  ComponentViewMethod
}
