import { Value, Type, Variable } from "../compiler/types/Types.js";
import { booleanPrimitiveType, doublePrimitiveType, intPrimitiveType, StringPrimitiveType, stringPrimitiveType } from "../compiler/types/PrimitiveTypes.js";
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

    value: Value;
    variable: Variable;

    type: Type;
    identifier: string;

    $debuggerElement: JQuery<HTMLElement>;

    constructor(caption: string, parent: DebuggerElement, identifier: string, value: Value, type: Type, variable: Variable) {
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
                    if (this.value != null && this.value.value != null) {
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

            let ro: RuntimeObject = this.value.value;
            let listHelper: ListHelper = ro.intrinsicData == null ? null : ro.intrinsicData["ListHelper"];
            if (listHelper != null) {
                this.renderListElements(listHelper);
            } else {
                if(this.value.value != null){
                    let type = (<RuntimeObject>this.value.value).class;
                    // for (let a of (<Klass>this.value.type).getAttributes(Visibility.private)) {
                    for (let a of (<Klass>type).getAttributes(Visibility.private)) {
                        let de = new DebuggerElement(null, this, a.identifier, ro.getValue(a.index), a.type, null);
                        de.render();
                        this.$debuggerElement.find('.jo_deChildContainer').append(de.$debuggerElement);
                    }
                }
            }


        } else if (this.type instanceof ArrayType) {

            let a = <Value[]>this.value.value;

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

            if (this.value.value != null && this.value.value instanceof RuntimeObject) {
                let ro: RuntimeObject = this.value.value;

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
                let v: Value = valueArray[i];
                let title = "" + i;
                if (i == 100) {
                    v = { type: stringPrimitiveType, value: "" + (listHelper.valueArray.length - 100) + " weitere..." };
                    title = "...";
                }
                // let de = new DebuggerElement(null, this, title, v, v.type, null);
                let de = new DebuggerElement(null, this, title, v, DebuggerElement.getType(v.value), null);
                de.render();
                this.$debuggerElement.find('.jo_deChildContainer').first().append(de.$debuggerElement);
            }
        }

    }

    static getType(v: any): Type {
        if(v == null) return stringPrimitiveType;
        switch(typeof v){
            case "string": return stringPrimitiveType;
            case "number": return v == Math.round(v) ? intPrimitiveType : doublePrimitiveType;
            case "boolean": return booleanPrimitiveType;
            case "object": 
                if(v.klass){
                    return v.klass;
                }
            default: return stringPrimitiveType;
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
        if (v.value == null) {
            s = "null";
            this.removeAllChildren();
        } else {

            if (v.updateValue != null) {
                v.updateValue(v);
            }

            s = v.type.debugOutput(v);

            if (this.type instanceof Klass) {

                let ro: RuntimeObject = this.value.value;
                let listHelper: ListHelper = ro.intrinsicData == null ? null : ro.intrinsicData["ListHelper"];
                if (listHelper != null) {
                    this.renderListElements(listHelper);
                    if(listHelper.allElementsPrimitive()){
                        s = "" +listHelper.valueArray.length + " El: "
                        s += "[" + listHelper.objectArray.slice(0, 20).map(o => "" + o).join(", ") + "]"
                    } else {
                        s = v.type.identifier + " (" +listHelper.valueArray.length + " Elemente)";
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