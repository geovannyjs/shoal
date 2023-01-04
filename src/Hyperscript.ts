import {
  normalizeChildren,
  Type as VNodeType,
  VNode
} from './VNode'
import { Component } from './Component'


const fragments = (...nodes: Array<any>): VNode => ({
  __sv__: true,
  type: VNodeType.Fragment,
  item: '',
  attrs: {},
  children: normalizeChildren(nodes)
})

const hyperscript = (item: Component<any> | string, ...args: Array<any>): VNode => {

  // if the second param is an attrs object
  let [attrs, children] = typeof args[0] === 'object' && !args[0].__sv__ && !Array.isArray(args[0]) ? [args[0], args.slice(1)] : [{}, args]

  return {
    __sv__: true,
    type: typeof item === 'function' ? VNodeType.Component : VNodeType.Tag,
    item: typeof item === 'function' ? item(attrs) : item,
    attrs,
    key: attrs.key ? attrs.key : null,
    children: normalizeChildren(children)
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
  fragments,
  hyperscript,
  trust
}
