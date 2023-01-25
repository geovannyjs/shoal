(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.shoal = {}));
})(this, (function (exports) { 'use strict';

    var Type$1;
    (function (Type) {
        Type[Type["Component"] = 0] = "Component";
        Type[Type["Fragment"] = 1] = "Fragment";
        Type[Type["Raw"] = 2] = "Raw";
        Type[Type["Tag"] = 3] = "Tag";
        Type[Type["Text"] = 4] = "Text";
    })(Type$1 || (Type$1 = {}));
    const normalize = (node) => {
        if (node.__sv__)
            return node;
        if (Array.isArray(node))
            return { __sv__: true, type: Type$1.Fragment, item: '', attrs: {}, children: normalizeChildren(node) };
        return { __sv__: true, type: Type$1.Text, item: String(node), attrs: {}, children: [] };
    };
    const normalizeChildren = (nodes) => {
        let normalized = [];
        let flattened = nodes.flat(Infinity);
        for (let i = 0; i < flattened.length; i++) {
            if (flattened[i] != null)
                normalized.push(normalize(flattened[i]));
        }
        return normalized;
    };

    const fragment = (...nodes) => ({
        __sv__: true,
        type: Type$1.Fragment,
        item: '',
        attrs: {},
        children: normalizeChildren(nodes)
    });
    const h = (item, ...args) => {
        // if the second param is an attrs object
        const [attrs, children] = args[0] != null && !args[0].__sv__ && typeof args[0] === 'object' && !Array.isArray(args[0]) ? [args[0], args.slice(1)] : [{}, args];
        const isComponent = typeof item === 'function';
        return {
            __sv__: true,
            type: isComponent ? Type$1.Component : Type$1.Tag,
            item,
            attrs,
            // component children do not need to be normalized, it will be normalized when component's view function is evaluated
            children: isComponent ? children : normalizeChildren(children)
        };
    };
    const trust = (html = '') => ({
        __sv__: true,
        type: Type$1.Raw,
        item: html,
        attrs: {},
        children: []
    });

    var Type;
    (function (Type) {
        Type[Type["Element"] = 1] = "Element";
        Type[Type["Attribute"] = 2] = "Attribute";
        Type[Type["Text"] = 3] = "Text";
        Type[Type["CDataSection"] = 4] = "CDataSection";
        Type[Type["ProcessingInstruction"] = 7] = "ProcessingInstruction";
        Type[Type["Comment"] = 8] = "Comment";
        Type[Type["Document"] = 9] = "Document";
        Type[Type["DocumentType"] = 10] = "DocumentType";
        Type[Type["Fragment"] = 11] = "Fragment";
    })(Type || (Type = {}));
    // FIXME it would be good to accept document as a param
    // so it would be possible to use something like jsdom
    const $doc = window.document;
    const setElementAttrs = (el, attrs) => {
        const keys = Object.keys(attrs);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let v = attrs[k];
            if (k.slice(0, 2) === 'on')
                el.addEventListener(k.slice(2), v);
            else
                el.setAttribute(k, v);
        }
    };
    const buildNode = (ref, vnode) => {
        const dispatcher = {
            [Type$1.Component]: buildNodeComponent,
            [Type$1.Fragment]: buildNodeFragment,
            [Type$1.Raw]: buildNodeRaw,
            [Type$1.Tag]: buildNodeTag,
            [Type$1.Text]: buildNodeText
        };
        return dispatcher[vnode.type](ref, vnode);
    };
    const buildNodeComponent = (ref, vnode) => {
        vnode.instance = vnode.item(vnode.attrs, ref.redraw);
        vnode.children = [vnode.instance.view({ attrs: vnode.attrs, children: vnode.children })];
        vnode.node = buildNode(ref, vnode.children[0]);
        return vnode.node;
    };
    const buildNodeFragment = (ref, vnode) => {
        vnode.node = $doc.createDocumentFragment();
        for (let i = 0; i < vnode.children.length; i++) {
            vnode.node.appendChild(buildNode(ref, vnode.children[i]));
            vnode.children[i].parent = vnode.node;
        }
        return vnode.node;
    };
    const buildNodeRaw = (ref, vnode) => {
        return $doc.createDocumentFragment();
    };
    const buildNodeTag = (ref, vnode) => {
        vnode.node = $doc.createElement(vnode.item);
        // set attrs
        setElementAttrs(vnode.node, vnode.attrs);
        // children
        for (let i = 0; i < vnode.children.length; i++) {
            vnode.node.appendChild(buildNode(ref, vnode.children[i]));
            vnode.children[i].parent = vnode.node;
        }
        return vnode.node;
    };
    const buildNodeText = (ref, vnode) => {
        vnode.node = $doc.createTextNode(vnode.item);
        return vnode.node;
    };

    const diff = (ref, old, cur, index = 0) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (old.type !== cur.type) {
            if (((_a = old.node) === null || _a === void 0 ? void 0 : _a.nodeType) === Type.Fragment) {
                let oldChildren = Array.from((_b = old.parent) === null || _b === void 0 ? void 0 : _b.childNodes);
                old.parent && (old.parent.textContent = '');
                let curNode = oldChildren.slice(0, index).concat(buildNode(ref, cur), oldChildren.slice(index + old.children.length + 1));
                for (let i = 0; i < curNode.length; i++)
                    (_c = old.parent) === null || _c === void 0 ? void 0 : _c.appendChild(curNode[i]);
            }
            else {
                old.node.replaceWith(buildNode(ref, cur));
            }
            cur.parent = old.parent;
            return;
        }
        else {
            // Text
            if (cur.type === Type$1.Text) {
                if (old.item != cur.item) {
                    old.node.textContent = cur.item;
                }
                cur.node = old.node;
                cur.parent = old.parent;
                return;
            }
            // Component
            else if (cur.type === Type$1.Component) {
                // component is different, so create a new instance
                if (old.item !== cur.item)
                    cur.instance = cur.item(cur.attrs, ref.redraw);
                else
                    cur.instance = old.instance;
                cur.children = cur.instance ? [(_d = cur.instance) === null || _d === void 0 ? void 0 : _d.view({ attrs: cur.attrs, children: cur.children })] : [];
            }
            // Tag
            else if (cur.type === Type$1.Tag) {
                if (old.item !== cur.item) {
                    old.node.replaceWith(buildNodeTag(ref, cur));
                    return;
                }
                // diff attrs
                else {
                    // if old attrs do not exist in the cur, delete them
                    const oldAttrs = Object.keys(old.attrs);
                    for (let i = 0; i < oldAttrs.length; i++) {
                        if (oldAttrs[i].slice(0, 2) === 'on') {
                            old.node.removeEventListener(oldAttrs[i].slice(2), old.attrs[oldAttrs[i]]);
                        }
                        else
                            old.node.removeAttribute(oldAttrs[i]);
                    }
                    // create all attrs from cur
                    setElementAttrs(old.node, cur.attrs);
                }
            }
            // for vnodes that may have children ( components, fragments and tags )
            // diff the children and keep the dom reference
            const toDiff = Math.min(old.children.length, cur.children.length);
            // cur has more children, so insert them
            if (toDiff < cur.children.length) {
                for (let i = toDiff; i < cur.children.length; i++) {
                    (_e = old.parent) === null || _e === void 0 ? void 0 : _e.appendChild(buildNode(ref, cur.children[i]));
                    cur.children[i].parent = old.node;
                }
            }
            // old has more children, so remove them
            else if (toDiff < old.children.length) {
                for (let i = toDiff; i < old.children.length; i++) {
                    if (((_f = old.node) === null || _f === void 0 ? void 0 : _f.nodeType) === Type.Fragment)
                        (_g = old.parent) === null || _g === void 0 ? void 0 : _g.removeChild(old.children[i].node);
                    else
                        (_h = old.node) === null || _h === void 0 ? void 0 : _h.removeChild(old.children[i].node);
                }
            }
            // diff the number of children in common
            for (let i = 0; i < toDiff; i++)
                diff(ref, old.children[i], cur.children[i], i);
            cur.node = old.node;
            cur.parent = old.parent;
        }
    };

    const rAF = typeof requestAnimationFrame === 'undefined' ? (fn) => fn() : requestAnimationFrame;
    const mount = (root) => (component) => {
        let oldVNode = fragment();
        // redraw
        const redraw = () => rAF(() => {
            const vnode = h(component);
            diff({ redraw }, oldVNode, vnode);
            oldVNode = vnode;
        });
        // first drawn
        rAF(() => {
            const vnode = h(component);
            // we start the old vnode as an empty fragment
            buildNodeFragment({ redraw }, oldVNode);
            oldVNode.parent = root;
            root.textContent = '';
            diff({ redraw }, oldVNode, vnode);
            oldVNode = vnode;
        });
        return redraw;
    };

    exports.fragment = fragment;
    exports.h = h;
    exports.mount = mount;
    exports.trust = trust;

}));
