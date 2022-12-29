import { VNode } from './VNode';
import { Component } from './Component';
declare const hyperscript: (item: Component | string, ...args: any[]) => VNode;
declare const trust: (html?: string) => VNode;
export { hyperscript, trust };