import { ComponentReturn } from './Component';
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
    item: ComponentReturn | string;
    key?: string;
    attrs: object;
    children: Array<VNode>;
    dom?: Node;
};
declare const normalizeChildren: (nodes: Array<any>) => Array<VNode>;
export { normalizeChildren, Type, VNode };
