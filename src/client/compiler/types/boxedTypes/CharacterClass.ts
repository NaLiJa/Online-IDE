import { RuntimeObject } from "../../../interpreter/RuntimeObject.js";
import { Klass } from "../Class.js";
import { booleanPrimitiveType, charPrimitiveType, intPrimitiveType, stringPrimitiveType } from "../PrimitiveTypes.js";
import { Method, NewValue, Parameterlist, Type, Value } from "../Types.js";


export class CharacterClass extends Klass {

    unboxableAs = [];

    constructor(baseClass: Klass) {
        super("Character", null, "Wrapper-Klasse, um char-Werte in Collections verenden zu können.");
        this.baseClass = baseClass;
        this.staticClass.setupAttributeIndicesRecursive();

        this.staticClass.classObject = new RuntimeObject(this.staticClass);

    }

    canCastTo(type: Type): boolean {
        return this.unboxableAs.indexOf(type) >= 0 || super.canCastTo(type);
    }

    init() {

        this.unboxableAs = [charPrimitiveType, stringPrimitiveType];

        this.addMethod(new Method("Character", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0] = parameters[1];

            }, false, false, "Instanziert ein neues Character-Objekt", true));


        this.addMethod(new Method("charValue", new Parameterlist([]), charPrimitiveType,
            (parameters) => { return parameters[0]; }, false, false, "Wandelt das Character-Objekt in einen char-Wert um"));

        this.addMethod(new Method("compareTo", new Parameterlist([
            { identifier: "anotherCharacter", type: this, declaration: null, usagePositions: null, isFinal: true }
        ]), intPrimitiveType,
            (parameters) => {
                let v0 = parameters[0];
                let v1 = parameters[1];
                if (v0 > v1) return 1;
                if (v0 < v1) return -1;
                return 0;
            }, false, false, "Ist der Wert größer als der übergebene Wert, so wird +1 zurückgegeben. Ist er kleiner, so wird -1 zurückgegeben. Sind die Werte gleich, so wird 0 zurückgegeben."));

        this.addMethod(new Method("equals", new Parameterlist([
            { identifier: "anotherCharacter", type: this, declaration: null, usagePositions: null, isFinal: true }
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[0] == parameters[1];
            }, false, false, "Gibt genau dann true zurück, wenn der Wert gleich dem übergebenen Wert ist."));

        this.addMethod(new Method("toString", new Parameterlist([
        ]), stringPrimitiveType,
            (parameters) => {
                return parameters[0];
            }, false, false, "Gibt den Wert des Objekts als String-Wert zurück."));

        this.addMethod(new Method("hashCode", new Parameterlist([
        ]), intPrimitiveType,
            (parameters) => {
                return (<string>parameters[0]).charCodeAt(0);
            }, false, false, "Gibt den hashCode des Objekts zurück."));

        this.addMethod(new Method("charValue", new Parameterlist([
        ]), charPrimitiveType,
            (parameters) => {
                return parameters[0];
            }, false, false, "Gibt den char-Wert des Objekts zurück."));

        this.addMethod(new Method("digit", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
            { identifier: "radix", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), intPrimitiveType,
            (parameters) => {
                return Number.parseInt(<string>parameters[1], <number>parameters[2]);
            }, false, true, "Gibt den numerischen Wert des Zeichens zur Basis radix zurück."));

        this.addMethod(new Method("forDigit", new Parameterlist([
            { identifier: "int-value", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
            { identifier: "radix", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), charPrimitiveType,
            (parameters) => {
                return (<number>parameters[1]).toString(<number>parameters[2]).charAt(0);
            }, false, true, "Gibt den übergebenen Wert als Ziffer im Zahlensystem zur Basis radix zurück."));

        this.addMethod(new Method("getNumericValue", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), intPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).charCodeAt(0);
            }, false, true, "Wandelt das Zeichen in einen numerischen Wert (Unicode-Wert) um."));

        this.addMethod(new Method("isLetter", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).match(/[a-zäöüß]/i) != null;
            }, false, true, "Gibt genau dann true zurück, wenn das Zeichen ein deutsches Alphabet-Zeichen ist."));

        this.addMethod(new Method("isLetterOrDigit", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).match(/[a-zäöüß0-9]/i) != null;
            }, false, true, "Gibt genau dann true zurück, wenn das Zeichen ein deutsches Alphabet-Zeichen oder eine Ziffer ist."));

        this.addMethod(new Method("isDigit", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).match(/[0-9]/i) != null;
            }, false, true, "Gibt genau dann true zurück, wenn das Zeichen eine Ziffer ist."));

            this.addMethod(new Method("isWhitespace", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).match(/[ \r\n\t]/i) != null;
            }, false, true, "Gibt genau dann true zurück, wenn das Zeichen ein Leerzeichen, Tabulatorzeichen oder Zeilenumbruch ist."));

        this.addMethod(new Method("toUpperCase", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), charPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).toLocaleUpperCase();
            }, false, true, "Wandelt das Zeichen in Großschreibung um."));

        this.addMethod(new Method("toLowerCase", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), charPrimitiveType,
            (parameters) => {
                return (<string>parameters[1]).toLocaleLowerCase();
            }, false, true, "Wandelt das Zeichen in Kleinschreibung um."));

        this.addMethod(new Method("valueOf", new Parameterlist([
            { identifier: "char-value", type: charPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), this,
            (parameters) => {
                return parameters[1];
            }, false, true, "Wandelt den char-Wert in ein Character-Objekt um."));


    }

    public debugOutput(value: NewValue): string {
        return "" + <number>value;
    }


}
