import { Redraw } from './mount';
import { VNode } from './VNode';
declare enum Type {
    Element = 1,
    Attribute = 2,
    Text = 3,
    CDataSection = 4,
    ProcessingInstruction = 7,
    Comment = 8,
    Document = 9,
    DocumentType = 10,
    Fragment = 11
}
declare const setElementAttrs: (el: Element, attrs: object) => void;
declare const buildNode: (redraw: Redraw, vnode: VNode) => Node;
declare const buildNodeFragment: (redraw: Redraw, vnode: VNode) => Node;
declare const buildNodeTag: (redraw: Redraw, vnode: VNode) => Node;
export { Type, buildNode, buildNodeFragment, buildNodeTag, setElementAttrs };
