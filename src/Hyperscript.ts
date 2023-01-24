import {
  normalizeChildren,
  Type as VNodeType,
  VNode
} from './VNode'
import { Component } from './Component'


const fragment = (...nodes: Array<any>): VNode => ({
  __sv__: true,
  type: VNodeType.Fragment,
  item: '',
  attrs: {},
  children: normalizeChildren(nodes)
})

const h = (item: Component<any> | string, ...args: Array<any>): VNode => {

  // if the second param is an attrs object
  const [attrs, children] = args[0] != null && !args[0].__sv__ && typeof args[0] === 'object' && !Array.isArray(args[0]) ? [args[0], args.slice(1)] : [{}, args]
  const isComponent = typeof item === 'function'

  return {
    __sv__: true,
    type: isComponent ? VNodeType.Component : VNodeType.Tag,
    item,
    attrs,
    // component children do not need to be normalized, it will be normalized when component's view function is evaluated
    children: isComponent ? children : normalizeChildren(children)
  }

}

const trust = (html: string = ''): VNode => ({
  __sv__: true,
  type: VNodeType.Raw,
  item: html,
  attrs: {},
  children: []
})

export {
  fragment,
  h,
  trust
}
