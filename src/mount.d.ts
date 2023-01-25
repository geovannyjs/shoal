import { Component } from './Component';
declare type Redraw = () => void;
declare type GlobalRef = {
    redraw: Redraw;
};
declare const mount: (root: Element) => (component: Component<any>) => Redraw;
export { GlobalRef, mount };
