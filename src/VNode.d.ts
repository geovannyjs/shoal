import { Component } from './Component';
declare enum Type {
    Component = 0,
    Fragment = 1,
    Raw = 2,
    Tag = 3,
    Text = 4
}
declare type VNode = {
    __shoalVNode__: boolean;
    type: Type;
    item: Component | string;
    key?: string | number;
    attrs: Object;
    children: Array<VNode>;
};
declare const normalizeChildren: () => Array<VNode>;
export { normalizeChildren, Type, VNode };
