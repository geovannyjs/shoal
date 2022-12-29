import { VNode } from './VNode';
declare type Attrs = {
    class?: string;
} & Object;
declare type ComponentLifeCycleMethods = {
    beforeRemove: () => any;
    beforeUpdate: () => any;
    ready: () => any;
    remove: () => any;
    update: () => any;
};
declare type ComponentViewMethod = {
    view: () => VNode;
};
declare type Component = (attrs: Attrs) => ComponentLifeCycleMethods & ComponentViewMethod;
export { Attrs, Component, ComponentLifeCycleMethods, ComponentViewMethod };
