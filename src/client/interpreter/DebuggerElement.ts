import { Value, Type, Variable, NewValue } from "../compiler/types/Types.js";
import { booleanPrimitiveType, doublePrimitiveType, getType, intPrimitiveType, StringPrimitiveType, stringPrimitiveType } from "../compiler/types/PrimitiveTypes.js";
import { ArrayType } from "../compiler/types/Array.js";
import { Klass, Visibility, StaticClass, Interface } from "../compiler/types/Class.js";
import { Enum } from "../compiler/types/Enum.js";
import { RuntimeObject } from "./RuntimeObject.js";
import { ListHelper } from "../runtimelibrary/collections/ArrayList.js";

export class DebuggerElement {

    caption: string; // only used for root elements, e.g. "Local variables"
    // if caption is set then value == null and parent == null

    parent: DebuggerElement;
    children: DebuggerElement[] = [];

    canOpen: boolean;
    isOpen: boolean = false;

    value: NewValue;
    variable: Variable;

    type: Type;
    identifier: string;

    $debuggerElement: JQuery<HTMLElement>;

    constructor(caption: string, parent: DebuggerElement, identifier: string, value: NewValue, type: Type, variable: Variable) {
        this.caption = caption;
        this.parent = parent;
        if (parent != null) {
            parent.children.push(this);
        }
        this.value = value;
        this.type = type;
        this.variable = variable;
        this.identifier = identifier;
    }

    getLevel(): number {
        return this.parent == null ? 0 : this.parent.getLevel() + 1;
    }

    getIndent(): number {
        // return this.getLevel() * 15;
        return this.getLevel() == 0 ? 0 : 15;
    }

    render() {

        if (this.$debuggerElement == null) {
            this.$debuggerElement = jQuery('<div>');
            this.$debuggerElement.addClass("jo_debuggerElement");
            this.$debuggerElement.css('margin-left', '' + this.getIndent() + 'px');

            let $deFirstLine = jQuery('<div class="jo_deFirstline"><span class="jo_deIdentifier">' +
                this.identifier + '</span>:&nbsp;<span class="jo_deValue"></span></div>');

            this.$debuggerElement.append($deFirstLine);

            // show compound types in own branch of visible tree
            if (this.type instanceof ArrayType ||
                (this.type instanceof Klass && !(this.type instanceof Enum) && !(this.type == stringPrimitiveType))
                || this.type instanceof StaticClass
                || this.type instanceof Interface
            ) {
                this.canOpen = true;
                this.$debuggerElement.addClass('jo_canOpen');
                this.$debuggerElement.append(jQuery('<div class="jo_deChildContainer"></div>'));

                this.$debuggerElement.find('.jo_deFirstline').on('mousedown', (event) => {
                    if (this.value != null) {
                        if (this.children.length == 0) {
                            this.onFirstOpening();
                        }
                        this.$debuggerElement.toggleClass('jo_expanded');
                        this.isOpen = !this.isOpen;
                    } else {
                        this.children = [];
                    }

                    event.stopPropagation();

                });

            }
        }

        this.renderValue();

    }

    onFirstOpening() {

        this.children = [];

        if (this.type instanceof Klass) {

            let ro: RuntimeObject = <RuntimeObject>this.value;
            let listHelper: ListHelper = ro.intrinsicData == null ? null : ro.intrinsicData["ListHelper"];
            if (listHelper != null) {
                this.renderListElements(listHelper);
            } else {
                if(this.value != null){
                    let type = (<RuntimeObject>this.value).class;
                    // for (let a of (<Klass>this.value.type).getAttributes(Visibility.private)) {
                    for (let a of (<Klass>type).getAttributes(Visibility.private)) {
                        let de = new DebuggerElement(null, this, a.identifier, ro.getValue(a.index), a.type, null);
                        de.render();
                        this.$debuggerElement.find('.jo_deChildContainer').append(de.$debuggerElement);
                    }
                }
            }


        } else if (this.type instanceof ArrayType) {

            let a = <NewValue[]>this.value;

            let $childContainer = this.$debuggerElement.find('.jo_deChildContainer');
            for (let i = 0; i < a.length && i < 100; i++) {

                let de = new DebuggerElement(null, this, "[" + i + "]", a[i], this.type.arrayOfType, null);
                de.render();
                $childContainer.append(de.$debuggerElement);

            }

        } else if (this.type instanceof StaticClass) {

            for (let a of this.type.getAttributes(Visibility.private)) {
                let ro = this.type.classObject;
                let de = new DebuggerElement(null, this, a.identifier, ro.getValue(a.index), a.type, null);
                de.render();
                this.$debuggerElement.find('.jo_deChildContainer').append(de.$debuggerElement);
            }

        } else if (this.type instanceof Interface) {

            if (this.value != null && this.value instanceof RuntimeObject) {
                let ro: RuntimeObject = this.value;

                for (let a of (<Klass>ro.class).getAttributes(Visibility.private)) {
                    let de = new DebuggerElement(null, this, a.identifier, ro.getValue(a.index), a.type, null);
                    de.render();
                    this.$debuggerElement.find('.jo_deChildContainer').append(de.$debuggerElement);
                }

            } else {
                this.children == [];
            }

        }

    }

    renderListElements(listHelper: ListHelper) {

        let valueArray = listHelper.valueArray;
        if (this.children.length > valueArray.length) {
            for (let i = valueArray.length; i < this.children.length; i++) {
                let childElement = this.children[i];
                childElement.$debuggerElement.remove();
            }
            this.children.splice(valueArray.length);
        }

        if (this.children.length < valueArray.length && this.children.length < 100) {
            for (let i = this.children.length; i < valueArray.length && i <= 100; i++) {
                let v: NewValue = valueArray[i];
                let title = "" + i;
                if (i == 100) {
                    v = "" + (listHelper.valueArray.length - 100) + " weitere..." ;
                    title = "...";
                }
                // let de = new DebuggerElement(null, this, title, v, v.type, null);
                let de = new DebuggerElement(null, this, title, v, getType(v), null);
                de.render();
                this.$debuggerElement.find('.jo_deChildContainer').first().append(de.$debuggerElement);
            }
        }

    }

    renderValue() {
        let s: string;
        let v = this.value;

        if (v == null) {
            this.$debuggerElement.hide();
            return;
        }

        this.$debuggerElement.show();
        if (v == null) {
            s = "null";
            this.removeAllChildren();
        } else {

            s = getType(v).debugOutput(v);

            if (this.type instanceof Klass) {

                let ro: RuntimeObject = <RuntimeObject>this.value;
                let listHelper: ListHelper = ro.intrinsicData == null ? null : ro.intrinsicData["ListHelper"];
                if (listHelper != null) {
                    this.renderListElements(listHelper);
                    if(listHelper.allElementsPrimitive()){
                        s = "" +listHelper.valueArray.length + " El: "
                        s += "[" + listHelper.valueArray.slice(0, 20).map(o => "" + o).join(", ") + "]"
                    } else {
                        s = getType(v).identifier + " (" +listHelper.valueArray.length + " Elemente)";
                    }
                }
            } 
            
        }

        this.$debuggerElement.find('.jo_deValue').first().html(s);


        for (let child of this.children) {
            child.renderValue();
        }
    }

    removeAllChildren() {
        for (let de of this.children) {
            de.$debuggerElement.remove();
        }
        this.children = []
    }

}