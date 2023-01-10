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
  view: ({ attrs, children }: { attrs: object, children: Array<VNode> }) => VNode
}

type ComponentReturn = ComponentLifeCycleMethods & ComponentViewMethod

type Component<T extends object> = (attrs: Attrs<T>, redraw: () => void) => ComponentReturn

export {
  Attrs,
  Component,
  ComponentLifeCycleMethods,
  ComponentReturn,
  ComponentViewMethod
}
