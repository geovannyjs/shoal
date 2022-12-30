import { VNode } from './VNode';
declare type Attrs = {
    class?: string;
} & Object;
declare type ComponentLifeCycleMethods = {
    beforeRemove: () => any;
    beforeUpdate: () => any;
    created: () => any;
    removed: () => any;
    updated: () => any;
};
declare type ComponentViewMethod = {
    view: () => VNode;
};
declare type Component = (attrs: Attrs) => ComponentLifeCycleMethods & ComponentViewMethod;
export { Attrs, Component, ComponentLifeCycleMethods, ComponentViewMethod };
