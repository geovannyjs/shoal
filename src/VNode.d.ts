import { Component, ComponentReturn } from './Component';
declare enum Type {
    Component = 0,
    Fragment = 1,
    Raw = 2,
    Tag = 3,
    Text = 4
}
declare type VNode = {
    __sv__: boolean;
    type: Type;
    item: Component<any> | string;
    instance?: ComponentReturn;
    attrs: object;
    children: Array<VNode>;
    node?: Node;
    parent?: Node;
};
declare const normalizeChildren: (nodes: Array<any>) => Array<VNode>;
export { normalizeChildren, Type, VNode };
