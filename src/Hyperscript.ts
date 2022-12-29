import { VNode, Type as VNodeType } from './VNode'
import { Component } from './Component'


const hyperscript = (item: Component | string, ...args: Array<any>): VNode => {

  return {
    __SVN__: true,
    type: VNodeType.Tag,
    item: 'div',
    children: []
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
