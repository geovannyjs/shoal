import { VNode } from './VNode';
import { Component } from './Component';
declare const fragment: (...nodes: Array<any>) => VNode;
declare const h: (item: Component<any> | string, ...args: Array<any>) => VNode;
declare const trust: (html?: string) => VNode;
export { fragment, h, trust };
