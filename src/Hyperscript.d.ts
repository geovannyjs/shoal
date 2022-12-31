import { VNode } from './VNode';
import { Component } from './Component';
declare const fragments: (...nodes: Array<any>) => VNode;
declare const hyperscript: (item: Component<any> | string, ...args: Array<any>) => VNode;
declare const trust: (html?: string) => VNode;
export { fragments, hyperscript, trust };
