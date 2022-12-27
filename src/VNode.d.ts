declare enum VNodeItem {
    Component = 0,
    Fragment = 1,
    HTML = 2,
    Tag = 3,
    Text = 4
}
declare type VNode = {
    item: VNodeItem;
    key: string | number | undefined;
    attrs: Object;
    children: Array<VNode> | VNode | string | number;
};
