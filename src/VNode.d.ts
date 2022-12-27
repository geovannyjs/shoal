import { Component } from './Component';
declare enum Type {
    Component = 0,
    Fragment = 1,
    HTML = 2,
    Tag = 3,
    Text = 4
}
declare type VNode = {
    __SVN__: boolean;
    type: Type;
    item?: Component | string;
    key?: string | number;
    attrs?: Object;
    children: Array<VNode>;
};
export { VNode, Type };
