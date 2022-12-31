import { VNode } from './VNode';
declare type Attrs<T> = {
    class?: string;
} & T;
declare type ComponentLifeCycleMethods = {
    beforeRemove?: () => any;
    beforeUpdate?: () => any;
    ready?: () => any;
    remove?: () => any;
    update?: () => any;
};
declare type ComponentViewMethod = {
    view: () => VNode;
};
declare type Component<T> = (attrs: Attrs<T>) => ComponentLifeCycleMethods & ComponentViewMethod;
export { Attrs, Component, ComponentLifeCycleMethods, ComponentViewMethod };
