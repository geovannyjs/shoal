import { VNode, Type as VNodeType } from './VNode'


type ElementContainer = Element & {
  queued: boolean
  vnode?: VNode 
}

type Renderer = () => void

// FIXME it would be good to accept document as a param
// so it would be possible to use something like jsdom
const $doc: Document = window.document

const buildNode = (vnode: VNode): Node => {
  const dispatcher = {
    [VNodeType.Component]: buildNodeComponent,
    [VNodeType.Fragment]: buildNodeFragment,
    [VNodeType.Raw]: buildNodeRaw,
    [VNodeType.Tag]: buildNodeTag,
    [VNodeType.Text]: buildNodeText
  }
  return dispatcher[vnode.type](vnode)
}

const buildNodeComponent = (vnode: VNode): Node => {
  return buildNode(vnode.children[0])
}

const buildNodeFragment = (vnode: VNode): Node => {
  const fragment = $doc.createDocumentFragment()
  vnode.children.forEach(vn => fragment.appendChild(buildNode(vn)))
  return fragment
}

const buildNodeRaw = (vnode: VNode): Node => {
  return $doc.createDocumentFragment()
}

const buildNodeTag = (vnode: VNode): Node => {
  vnode.dom = $doc.createElement(<string>vnode.item)

  // set attrs
  Object.entries(vnode.attrs).forEach(([k, v]) => (<HTMLElement>vnode.dom).setAttribute(k, v))

  // children
  vnode.children.forEach(vn => vnode.dom?.appendChild(buildNode(vn)))

  return vnode.dom
}

const buildNodeText = (vnode: VNode): Node => {
  vnode.dom = $doc.createTextNode(<string>vnode.item)
  return vnode.dom
}

// parent will be useful when the old vnode is undefined but the cur vnode is defined (insert operation)
const diff = (old?: VNode, cur?: VNode, parent?: Node): void => {

  // just the old - remove
  if(old && !cur) {}

  // just the cur - insert
  else if(!old && cur) {}

  // from now on, both
  else if(old && cur) {

    // Component
    if(old.type === VNodeType.Component && cur.type === VNodeType.Component) {
      for(let i=0; i < old.children.length; i++) diff(old.children[i], cur.children[i])
    }

    // Fragment
    if(old.type === VNodeType.Fragment && cur.type === VNodeType.Fragment) {
      for(let i=0; i < old.children.length; i++) diff(old.children[i], cur.children[i])
    }

    // Tag
    if(old.type === VNodeType.Tag && cur.type === VNodeType.Tag) {
      //(<Element>old.dom).replaceWith(buildNodeText(cur))
      for(let i=0; i < old.children.length; i++) diff(old.children[i], cur.children[i])
    }

    // Text
    if(old.type === VNodeType.Text && cur.type === VNodeType.Text) {
      ;(<Element>old.dom).textContent = <string>cur.item
      cur.dom = old.dom
    }

  }

}

const rAF = typeof requestAnimationFrame === 'undefined' ? (fn: Function) => fn() : requestAnimationFrame

const mount = (root: Element) => (vNodeProvider: () => VNode): Renderer => {

  const rAFCaller = (fn: () => VNode) => !(<ElementContainer>root).queued && rAF(() => {
    ;(<ElementContainer>root).queued = true
    const vnode = fn()
    ;(<ElementContainer>root).vnode = vnode
    ;(<ElementContainer>root).queued = false
  })

  // first drawn
  rAFCaller(() => {
    const vnode = vNodeProvider()
    root.textContent = ''
    root.appendChild(buildNode(vnode))
    return vnode
  })

  return () => {
    rAFCaller(() => { 
      const vnode = vNodeProvider()
      diff((<ElementContainer>root).vnode, vnode)
      return vnode
    })
  }
}

export {
  mount
}
