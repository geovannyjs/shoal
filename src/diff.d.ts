import { GlobalRef } from './mount';
import { VNode } from './VNode';
declare const diff: (ref: GlobalRef, old: VNode, cur: VNode, index?: number) => void;
export { diff };
