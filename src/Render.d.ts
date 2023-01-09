import { Component } from './Component';
declare type Renderer = () => void;
declare const mount: (root: Element) => (component: Component<any>) => Renderer;
export { mount };
