import { VNode } from './VNode';
declare type Attrs<T extends object> = T;
declare type ComponentLifeCycleMethods = {
    afterCreate?: () => any;
    afterRemove?: () => any;
    afterUpdate?: () => any;
    beforeRemove?: () => boolean;
    beforeUpdate?: () => boolean;
};
declare type ComponentViewMethod = {
    view: () => VNode;
};
declare type Component<T extends object> = (attrs: Attrs<T>) => ComponentLifeCycleMethods & ComponentViewMethod;
export { Attrs, Component, ComponentLifeCycleMethods, ComponentViewMethod };
