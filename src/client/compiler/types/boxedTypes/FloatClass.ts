import { Klass, Visibility } from "../Class.js";
import { Method, Parameterlist, Attribute, Value, Type, PrimitiveType, NewValue } from "../Types.js";
import { intPrimitiveType, stringPrimitiveType, doublePrimitiveType, floatPrimitiveType, booleanPrimitiveType } from "../PrimitiveTypes.js";
import { RuntimeObject } from "../../../interpreter/RuntimeObject.js";


export class FloatClass extends Klass {

    unboxableAs = [];

    constructor(baseClass: Klass) {
        super("Float", null, "Wrapper-Klasse, um float-Werte in Collections verenden zu können.");
        this.baseClass = baseClass;

        this.addAttribute(new Attribute("MAX_VALUE", floatPrimitiveType, (ro) => { return Number.MAX_VALUE }, true, Visibility.public, true, "Der größte Wert, den eine Variable vom Typ float annehmen kann"));
        this.addAttribute(new Attribute("MIN_VALUE", floatPrimitiveType, (ro) => { return Number.MIN_VALUE }, true, Visibility.public, true, "Der kleinste Wert, den eine Variable vom Typ float annehmen kann"));
        this.addAttribute(new Attribute("NaN_VALUE", floatPrimitiveType, (ro) => { return Number.NaN }, true, Visibility.public, true, "Der \"Not a Number\"-Wert vom Typ float"));
        this.addAttribute(new Attribute("NEGATIVE_INFINITY", floatPrimitiveType, (ro) => { return Number.NEGATIVE_INFINITY }, true, Visibility.public, true, "Der \"negative infinity\"-Wert vom Typ float"));
        this.addAttribute(new Attribute("POSITIVE_INFINITY", floatPrimitiveType, (ro) => { return Number.POSITIVE_INFINITY }, true, Visibility.public, true, "Der \"positive infinity\"-Wert vom Typ float"));
        this.staticClass.setupAttributeIndicesRecursive();

        this.staticClass.classObject = new RuntimeObject(this.staticClass);

    }

    canCastTo(type: Type): boolean {
        return this.unboxableAs.indexOf(type) >= 0 || super.canCastTo(type);
    }

    init() {

        this.unboxableAs = [floatPrimitiveType, doublePrimitiveType];

        this.addMethod(new Method("Float", new Parameterlist([
            { identifier: "double-value", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0] = parameters[1];

            }, false, false, "Instanziert ein neues Float-Objekt", true));

        this.addMethod(new Method("Float", new Parameterlist([
            { identifier: "int-value", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0] = parameters[1];

            }, false, false, "Instanziert ein neues Float-Objekt", true));

        this.addMethod(new Method("Float", new Parameterlist([
            { identifier: "text", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0] = Number.parseFloat(<string>parameters[1]);

            }, false, false, "Instanziert ein neues Float-Objekt, indem die übergebene Zeichenkette in einen float-Wert umgewandelt wird.", true));


        this.addMethod(new Method("doubleValue", new Parameterlist([]), doublePrimitiveType,
            (parameters) => { return parameters[0]; }, false, false, "Wandelt das Float-Objekt in einen double-Wert um."));
        this.addMethod(new Method("floatValue", new Parameterlist([]), floatPrimitiveType,
            (parameters) => { return parameters[0]; }, false, false, "Wandelt das Float-Objekt in einen float-Wert um."));
        this.addMethod(new Method("intValue", new Parameterlist([]), intPrimitiveType,
            (parameters) => { return Math.trunc(<number>parameters[0]); }, false, false, "Wandelt das Float-Objekt durch Abrunden in einen int-Wert um."));

        this.addMethod(new Method("compareTo", new Parameterlist([
            { identifier: "anotherFloat", type: this, declaration: null, usagePositions: null, isFinal: true }
        ]), intPrimitiveType,
            (parameters) => {
                let v0 = parameters[0];
                let v1 = parameters[1];
                if (v0 > v1) return 1;
                if (v0 < v1) return -1;
                return 0;
            }, false, false, "Ist der Wert größer als der übergebene Wert, so wird +1 zurückgegeben. Ist er kleiner, so wird -1 zurückgegeben. Sind die Werte gleich, so wird 0 zurückgegeben."));

        this.addMethod(new Method("equals", new Parameterlist([
            { identifier: "anotherFloat", type: this, declaration: null, usagePositions: null, isFinal: true }
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[0] == parameters[1];
            }, false, false, "Gibt genau dann true zurück, wenn der Wert gleich dem übergebenen Wert ist."));

        this.addMethod(new Method("toString", new Parameterlist([
        ]), stringPrimitiveType,
            (parameters) => {
                return "" + parameters[0];
            }, false, false, "Gibt den Wert des Objekts als String-Wert zurück."));

        this.addMethod(new Method("hashCode", new Parameterlist([
        ]), intPrimitiveType,
            (parameters) => {
                return Math.trunc(<number>parameters[0]);
            }, false, false, "Gibt den hashCode des Objekts zurück."));

        this.addMethod(new Method("parseFloat", new Parameterlist([
            { identifier: "s", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), floatPrimitiveType,
            (parameters) => {
                return Number.parseFloat(<string>parameters[1]);
            }, false, true, "Wandelt die Zeichenkette in einen float-Wert um"));

        this.addMethod(new Method("toString", new Parameterlist([
            { identifier: "f", type: floatPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), stringPrimitiveType,
            (parameters) => {
                return "" + parameters[1];
            }, false, true, "Gibt die übergebene Zahl als String-Wert zurück."));

        this.addMethod(new Method("valueOf", new Parameterlist([
            { identifier: "f", type: floatPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), this,
            (parameters) => {
                return parameters[1];
            }, false, true, "Gibt die übergebene Zahl als Float-Objekt zurück."));

        this.addMethod(new Method("valueOf", new Parameterlist([
            { identifier: "s", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), this,
            (parameters) => {
                return Number.parseFloat(<string>parameters[1]);
            }, false, true, "Interpretiert die übergebene Zeichenkette als Dezimalzahl und gib sie als Float-Objekt zurück."));

        this.addMethod(new Method("isNaN", new Parameterlist([
            { identifier: "f", type: floatPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return Number.isNaN(<number>parameters[1])
            }, false, true, "Gibt genau dann true zurück, falls die übergebene float-Zahl NaN (not a Number) ist."));

        this.addMethod(new Method("isNaN", new Parameterlist([
        ]), booleanPrimitiveType,
            (parameters) => {
                return Number.isNaN(<number>parameters[0])
            }, false, false, "Gibt genau dann true zurück, falls das Objekt NaN (not a Number) ist."));

        this.addMethod(new Method("isInfinite", new Parameterlist([
            { identifier: "f", type: floatPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[1] == Infinity;
            }, false, true, "Gibt genau dann true zurück, falls die übergebene float-Zahl INFINTITY ist."));

        this.addMethod(new Method("isInfinite", new Parameterlist([
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[0] == Infinity;
            }, false, false, "Gibt genau dann true zurück, falls das Objekt INFINITY ist."));

    }

    public debugOutput(value: NewValue): string {
        return "" + <number>value;
    }


}
