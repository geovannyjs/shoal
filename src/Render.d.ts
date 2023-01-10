import { Component } from './Component';
declare type Redraw = () => void;
declare const mount: (root: Element) => (component: Component<any>) => Redraw;
export { mount };
