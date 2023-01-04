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

type Component<T extends object> = (attrs: Attrs<T>) => ComponentLifeCycleMethods & ComponentViewMethod

export {
  Attrs,
  Component,
  ComponentLifeCycleMethods,
  ComponentViewMethod
}
