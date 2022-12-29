import { VNode, Type as VNodeType } from './VNode'
import { Component } from './Component'


const hyperscript = (item: Component | string, ...children: Array<any>): VNode => {

  return {
    __SVN__: true,
    type: typeof item === 'function' ? VNodeType.Component : VNodeType.Tag,
    item,
    children
  }

}

const trust = (html: string = ""): VNode => {

  return {
    __SVN__: true,
    type: VNodeType.Raw,
    item: html,
    children: []
  }

}

export {
  hyperscript,
  trust
}
