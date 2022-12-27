import { VNode, Type as VNodeType } from './VNode'


const h = (select: string): VNode => {

  return {
    type: VNodeType.Tag,
    item: 'div',
    children: []
  }

}

export {
  h
}
