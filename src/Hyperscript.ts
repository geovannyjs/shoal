import {
  normalizeChildren,
  Type as VNodeType,
  VNode
} from './VNode'
import { Component } from './Component'
import { pure } from './Object'


const fragments = (...nodes: Array<any>): VNode => pure({
  __sv__: true,
  type: VNodeType.Fragment,
  item: '',
  attrs: pure(),
  children: normalizeChildren(nodes)
})

const h = (item: Component<any> | string, ...args: Array<any>): VNode => {

  // if the second param is an attrs object
  const [attrs, children] = args[0] != null && !args[0].__sv__ && typeof args[0] === 'object' && !Array.isArray(args[0]) ? [args[0], args.slice(1)] : [pure(), args]
  const isComponent = typeof item === 'function'

  return pure({
    __sv__: true,
    type: isComponent ? VNodeType.Component : VNodeType.Tag,
    item,
    attrs,
    children: isComponent ? children : normalizeChildren(children)
  })

}

const trust = (html: string = ''): VNode => pure({
  __sv__: true,
  type: VNodeType.Raw,
  item: html,
  attrs: pure(),
  children: []
})

export {
  fragments,
  h,
  trust
}
