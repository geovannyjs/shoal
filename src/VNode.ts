enum VNodeItem {
  Component = 0,
  Fragment,
  HTML,
  Tag,
  Text
}

type VNode = {
  item: VNodeItem
  key: string | number | undefined
  attrs: Object
  children: Array<VNode> | VNode | string | number
}
