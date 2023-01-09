import { VNode } from './VNode';
declare type Renderer = (v: VNode) => void;
declare const container: (root: Element) => Renderer;
export { container };
