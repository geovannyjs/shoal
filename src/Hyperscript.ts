import {
  normalizeChildren,
  Type as VNodeType,
  VNode
} from './VNode'
import { Component, ComponentReturn } from './Component'


const fragments = (...nodes: Array<any>): VNode => ({
  __sv__: true,
  type: VNodeType.Fragment,
  item: '',
  attrs: {},
  children: normalizeChildren(nodes)
})

const hyperscript = (item: Component<any> | string, ...args: Array<any>): VNode => {

  // if the second param is an attrs object
  const [attrs, children] = typeof args[0] === 'object' && !args[0].__sv__ && !Array.isArray(args[0]) ? [args[0], args.slice(1)] : [{}, args]
  const isComponent = typeof item === 'function'
  const evaluatedItem = isComponent ? item(attrs) : item

  return {
    __sv__: true,
    type: isComponent ? VNodeType.Component : VNodeType.Tag,
    item: evaluatedItem,
    attrs,
    key: attrs.key ? String(attrs.key) : undefined,
    children: isComponent ? [(<ComponentReturn>evaluatedItem).view({ attrs, children })] : normalizeChildren(children)
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
