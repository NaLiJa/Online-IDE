import { Type, Method, Parameterlist, Value, Attribute } from "../../compiler/types/Types.js";
import { Klass, Visibility } from "../../compiler/types/Class.js";
import { stringPrimitiveType, doublePrimitiveType, floatPrimitiveType, intPrimitiveType } from "../../compiler/types/PrimitiveTypes.js";
import { Module } from "../../compiler/parser/Module.js";
import { PrintManager } from "../../main/gui/PrintManager.js";
import { RuntimeObject } from "../../interpreter/RuntimeObject.js";

export class KeyClass extends Klass {

    constructor(module: Module) {
        super("Key", module, "Aufzählung von Sondertasten zur Benutzung in den Methoden Actor.onKeyUp, Actor.onKeyTyped und Actor.onKeyDown");

        this.setBaseClass(<Klass>module.typeStore.getType("Object"));

        this.addAttribute(new Attribute("ArrowUp", stringPrimitiveType, (ro) => { return "ArrowUp" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("ArrowDown", stringPrimitiveType, (ro) => { return "ArrowDown" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("ArrowLeft", stringPrimitiveType, (ro) => { return "ArrowLeft" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("ArrowRight", stringPrimitiveType, (ro) => { return "ArrowRight" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Enter", stringPrimitiveType, (ro) => { return "Enter" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Space", stringPrimitiveType, (ro) => { return " " }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Shift", stringPrimitiveType, (ro) => { return "Shift" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Alt", stringPrimitiveType, (ro) => { return "Alt" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Strg", stringPrimitiveType, (ro) => { return "Control" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("PageUp", stringPrimitiveType, (ro) => { return "PageUp" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("PageDown", stringPrimitiveType, (ro) => { return "PageDown" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Backspace", stringPrimitiveType, (ro) => { return "Backspace" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Escape", stringPrimitiveType, (ro) => { return "Escape" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Entf", stringPrimitiveType, (ro) => { return "Delete" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Einf", stringPrimitiveType, (ro) => { return "Insert" }, true, Visibility.public, true, ""));
        this.addAttribute(new Attribute("Ende", stringPrimitiveType, (ro) => { return "End" }, true, Visibility.public, true, ""));

        this.staticClass.setupAttributeIndicesRecursive();

        this.staticClass.classObject = new RuntimeObject(this.staticClass);


    }

}