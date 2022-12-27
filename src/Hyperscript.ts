import { VNode, Type as VNodeType } from './VNode'
import { Component } from './Component'


const hyperscript = (item: Component | string, ...args): VNode => {

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
    type: VNodeType.HTML,
    item: html,
    children: []
  }

}

export {
  hyperscript,
  trust
}
