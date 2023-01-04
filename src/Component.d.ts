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
    view: ({ attrs, children }: {
        attrs: object;
        children: Array<VNode>;
    }) => VNode;
};
declare type ComponentReturn = ComponentLifeCycleMethods & ComponentViewMethod;
declare type Component<T extends object> = (attrs: Attrs<T>) => ComponentReturn;
export { Attrs, Component, ComponentLifeCycleMethods, ComponentReturn, ComponentViewMethod };
