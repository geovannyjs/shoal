import { VNode } from './VNode';
declare type Renderer = () => void;
declare const mount: (root: Element) => (vNodeProvider: () => VNode) => Renderer;
export { mount };
