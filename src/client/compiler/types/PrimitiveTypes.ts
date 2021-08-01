import { TokenType } from "../lexer/Token.js";
import { ArrayType } from "./Array.js";
import { Interface, Klass, setBooleanPrimitiveTypeCopy } from "./Class.js";
import { ObjectClass } from "./ObjectClass.js";
import { Method, NewValue, Parameterlist, PrimitiveType, Type, Value } from "./Types.js";
import { IntegerClass } from "./boxedTypes/IntegerClass.js";
import { FloatClass } from "./boxedTypes/FloatClass.js";
import { CharacterClass } from "./boxedTypes/CharacterClass.js";
import { BooleanClass } from "./boxedTypes/BooleanClass.js";
import { DoubleClass } from "./boxedTypes/DoubleClass.js";

export class NullType extends Type {

    constructor() {
        super();
        this.identifier = "null";
    }

    getResultType(operation: TokenType, secondOperandType: Type) {
        return null;
    }
    compute(operation: TokenType, firstOperand: NewValue, secondOperand: NewValue) {
        return null;
    }
    canCastTo(type: Type) {
        return (type instanceof Klass || type instanceof Interface);
    }
    castTo(value: NewValue, type: Type) {
        return value;
    }
    equals(type: Type) {
        return (type instanceof Klass || type instanceof Interface);
    }

    public debugOutput(value: NewValue): string {
        return "null";
    }
}

export class VarType extends Type {

    constructor() {
        super();
        this.identifier = "var";
    }

    getResultType(operation: TokenType, secondOperandType: Type) {
        return null;
    }
    compute(operation: TokenType, firstOperand: NewValue, secondOperand: NewValue) {
        return null;
    }
    canCastTo(type: Type) {
        return (type instanceof Klass || type instanceof Interface);
    }
    castTo(value: NewValue, type: Type) {
        return value;
    }
    equals(type: Type) {
        return (type instanceof Klass || type instanceof Interface);
    }

    public debugOutput(value: NewValue): string {
        return "var";
    }
}

export class IntPrimitiveType extends PrimitiveType {

    init() {
        this.initialValue = 0;

        this.identifier = "int";

        this.description = "ganze Zahl"

        this.operationTable = {
            [TokenType.plus]: { "int": intPrimitiveType, "Integer": intPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType, "String": stringPrimitiveType },
            [TokenType.minus]: { "none": intPrimitiveType, "int": intPrimitiveType, "Integer": intPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.multiplication]: { "int": intPrimitiveType, "Integer": intPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.modulo]: { "int": intPrimitiveType, "Integer": intPrimitiveType },
            [TokenType.division]: { "int": intPrimitiveType, "Integer": intPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.doublePlus]: { "none": intPrimitiveType },
            [TokenType.doubleMinus]: { "none": intPrimitiveType },
            [TokenType.negation]: { "none": intPrimitiveType },
            [TokenType.tilde]: { "none": intPrimitiveType },
            [TokenType.lower]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.greater]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.lowerOrEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.greaterOrEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.equal]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.notEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },

            // binary ops
            [TokenType.OR]: { "int": intPrimitiveType, "Integer": intPrimitiveType },
            [TokenType.XOR]: { "int": intPrimitiveType, "Integer": intPrimitiveType },
            [TokenType.ampersand]: { "int": intPrimitiveType, "Integer": intPrimitiveType },
            [TokenType.shiftLeft]: { "int": intPrimitiveType, "Integer": intPrimitiveType },
            [TokenType.shiftRight]: { "int": intPrimitiveType, "Integer": intPrimitiveType },
            [TokenType.shiftRightUnsigned]: { "int": intPrimitiveType, "Integer": intPrimitiveType }

        };

        // this.canCastTolist = [floatPrimitiveType, doublePrimitiveType, stringPrimitiveType, charPrimitiveType];

        this.canCastToMap = {
            "float": { automatic: true, needsStatement: false },
            "double": { automatic: true, needsStatement: false },
            "String": { automatic: true, needsStatement: true },
            "char": { automatic: true, needsStatement: true },
            "int": { automatic: true, needsStatement: false },
            "Integer": { automatic: true, needsStatement: false },
        }


    }

    toTokenType(): TokenType {
        return TokenType.integerConstant;
    }

    public castTo(value: NewValue, type: Type): NewValue {

        if (type == floatPrimitiveType || type == doublePrimitiveType) {
            return value;
        }

        if (type == stringPrimitiveType) {
            return  "" + <number>value;
        }

        if (type == charPrimitiveType) {
            return String.fromCharCode(<number>value);
        }

    }


    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        let value = <number>(firstOperand);

        switch (operation) {
            case TokenType.plus:
                if (typeof secondOperand == "string") {
                    return value + <string>(secondOperand);
                } else {
                    return value + <number>(secondOperand);
                }

            case TokenType.minus:
                if (secondOperand == null) return -value;
                return value - <number>(secondOperand);

            case TokenType.multiplication:
                return value * <number>(secondOperand);

            case TokenType.division:
                if (Math.round(<number>secondOperand) == secondOperand) {
                    return Math.trunc(value / <number>(secondOperand));
                }
                return value / <number>(secondOperand);

            case TokenType.modulo:
                if (Math.round(<number>secondOperand) == secondOperand) {
                    return Math.trunc(value % <number>(secondOperand));
                }
                return 1;

            case TokenType.doublePlus:
                return value++;

            case TokenType.doubleMinus:
                return value--;

            case TokenType.negation:
                return -value;

            case TokenType.tilde:
                return ~value;

            case TokenType.lower:
                return value < (<number>(secondOperand));

            case TokenType.greater:
                return value > <number>(secondOperand);

            case TokenType.lowerOrEqual:
                return value <= <number>(secondOperand);

            case TokenType.greaterOrEqual:
                return value >= <number>(secondOperand);

            case TokenType.equal:
                return value == <number>(secondOperand);

            case TokenType.notEqual:
                return value != <number>(secondOperand);

            case TokenType.OR:
                return value | <number>(secondOperand);

            case TokenType.XOR:
                return value ^ <number>(secondOperand);

            case TokenType.ampersand:
                return value & <number>(secondOperand);

            case TokenType.shiftLeft:
                return value << <number>(secondOperand);

            case TokenType.shiftRight:
                return value >> <number>(secondOperand);

            case TokenType.shiftRightUnsigned:
                return value >>> <number>(secondOperand);

        }


    }

    public debugOutput(value: NewValue): string {
        return "" + <number>value;
    }


}

export class FloatPrimitiveType extends PrimitiveType {

    init() {

        this.initialValue = 0;

        this.identifier = "float";

        this.description = "Fließkommazahl mit einfacher Genauigkeit"

        this.operationTable = {
            [TokenType.plus]: { "Integer": floatPrimitiveType, "int": floatPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType, "String": stringPrimitiveType },
            [TokenType.minus]: { "none": floatPrimitiveType, "Integer": floatPrimitiveType, "int": floatPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.multiplication]: { "Integer": floatPrimitiveType, "int": floatPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.division]: { "Integer": floatPrimitiveType, "int": floatPrimitiveType, "float": floatPrimitiveType, "Float": floatPrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.doublePlus]: { "none": floatPrimitiveType },
            [TokenType.doubleMinus]: { "none": floatPrimitiveType },
            [TokenType.negation]: { "none": floatPrimitiveType },
            [TokenType.lower]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.greater]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.lowerOrEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.greaterOrEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.equal]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.notEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
        };

        // this.canCastTolist = [intPrimitiveType, stringPrimitiveType, doublePrimitiveType];

        this.canCastToMap = {
            "int": { automatic: false, needsStatement: true },
            "double": { automatic: true, needsStatement: false },
            "float": { automatic: true, needsStatement: false },
            "String": { automatic: true, needsStatement: true },
            "Float": { automatic: true, needsStatement: false },
            "Double": { automatic: true, needsStatement: false },
        }

    }

    toTokenType(): TokenType {
        return TokenType.floatingPointConstant;
    }

    public castTo(value: NewValue, type: Type): NewValue {

        if (type == stringPrimitiveType) {
            return "" + <number>value;
        }

        if (type == intPrimitiveType) {
            return Math.trunc(<number>value);
        }

        if (type == doublePrimitiveType) {
            return value;
        }

    }


    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        let value = <number>(firstOperand);

        switch (operation) {
            case TokenType.plus:
                if (typeof secondOperand == "string") {
                    return value + <string>(secondOperand);
                } else {
                    return value + <number>(secondOperand);
                }

            case TokenType.minus:
                if (secondOperand == null) return -value;
                return value - <number>(secondOperand);

            case TokenType.multiplication:
                return value * <number>(secondOperand);

            case TokenType.division:
                return value / <number>(secondOperand);

            case TokenType.doublePlus:
                return value++;

            case TokenType.doubleMinus:
                return value--;

            case TokenType.negation:
                return -value;

            case TokenType.lower:
                return value < (<number>(secondOperand));

            case TokenType.greater:
                return value > <number>(secondOperand);

            case TokenType.lowerOrEqual:
                return value <= <number>(secondOperand);

            case TokenType.greaterOrEqual:
                return value >= <number>(secondOperand);

            case TokenType.equal:
                return value == <number>(secondOperand);

            case TokenType.notEqual:
                return value != <number>(secondOperand);

        }


    }

    public debugOutput(value: NewValue): string {
        return "" + <number>value;
    }


}

export class DoublePrimitiveType extends PrimitiveType {

    init() {

        this.initialValue = 0;

        this.identifier = "double";

        this.description = "Fließkommazahl mit doppelter Genauigkeit"

        this.operationTable = {
            [TokenType.plus]: { "int": doublePrimitiveType, "Integer": doublePrimitiveType, "float": doublePrimitiveType, "Float": doublePrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType, "String": stringPrimitiveType },
            [TokenType.minus]: { "none": doublePrimitiveType, "int": doublePrimitiveType, "Integer": doublePrimitiveType, "float": doublePrimitiveType, "Float": doublePrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.multiplication]: { "int": doublePrimitiveType, "Integer": doublePrimitiveType, "float": doublePrimitiveType, "Float": doublePrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.division]: { "int": doublePrimitiveType, "Integer": doublePrimitiveType, "float": doublePrimitiveType, "Float": doublePrimitiveType, "double": doublePrimitiveType, "Double": doublePrimitiveType },
            [TokenType.doublePlus]: { "none": doublePrimitiveType },
            [TokenType.doubleMinus]: { "none": doublePrimitiveType },
            [TokenType.negation]: { "none": doublePrimitiveType },
            [TokenType.lower]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.greater]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.lowerOrEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.greaterOrEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.equal]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
            [TokenType.notEqual]: { "int": booleanPrimitiveType, "float": booleanPrimitiveType, "double": booleanPrimitiveType, "Integer": booleanPrimitiveType, "Float": booleanPrimitiveType, "Double": booleanPrimitiveType },
        };

        // this.canCastTolist = [intPrimitiveType, stringPrimitiveType, floatPrimitiveType];
        this.canCastToMap = {
            "int": { automatic: false, needsStatement: true },
            "float": { automatic: true, needsStatement: false },
            "double": { automatic: true, needsStatement: false },
            "String": { automatic: true, needsStatement: true },
            "Float": { automatic: true, needsStatement: false },
            "Double": { automatic: true, needsStatement: false },
        }


    }

    toTokenType(): TokenType {
        return TokenType.floatingPointConstant;
    }

    public castTo(value: NewValue, type: Type): NewValue {

        if (type == stringPrimitiveType) {
            return "" + <number>value;
        }

        if (type == intPrimitiveType) {
            return Math.trunc(<number>value);
        }

        if (type == floatPrimitiveType) {
            return value;
        }

    }


    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        let value = <number>(firstOperand);

        switch (operation) {
            case TokenType.plus:
                if (typeof secondOperand == "string") {
                    return value + <string>(secondOperand);
                } else {
                    return value + <number>(secondOperand);
                }

            case TokenType.minus:
                if (secondOperand == null) return -value;
                return value - <number>(secondOperand);

            case TokenType.multiplication:
                return value * <number>(secondOperand);

            case TokenType.division:
                return value / <number>(secondOperand);

            case TokenType.doublePlus:
                return value++;

            case TokenType.doubleMinus:
                return value--;

            case TokenType.negation:
                return -value;

            case TokenType.lower:
                return value < (<number>(secondOperand));

            case TokenType.greater:
                return value > <number>(secondOperand);

            case TokenType.lowerOrEqual:
                return value <= <number>(secondOperand);

            case TokenType.greaterOrEqual:
                return value >= <number>(secondOperand);

            case TokenType.equal:
                return value == <number>(secondOperand);

            case TokenType.notEqual:
                return value != <number>(secondOperand);

        }


    }

    public debugOutput(value: NewValue): string {
        return "" + <number>value;
    }


}

export class BooleanPrimitiveType extends PrimitiveType {

    init() {

        this.initialValue = false;

        this.identifier = "boolean";

        this.description = "boolescher Wert (true oder false)"

        this.operationTable = {
            [TokenType.plus]: { "String": stringPrimitiveType },
            [TokenType.and]: { "boolean": booleanPrimitiveType },
            [TokenType.or]: { "boolean": booleanPrimitiveType },
            [TokenType.not]: { "none": booleanPrimitiveType },
            [TokenType.equal]: { "boolean": booleanPrimitiveType },
            [TokenType.notEqual]: { "boolean": booleanPrimitiveType },
        };

        this.canCastToMap = {
            "String": { automatic: true, needsStatement: true },
            "boolean": { automatic: true, needsStatement: false },
            "Boolean": { automatic: true, needsStatement: false },
        }


    }

    toTokenType(): TokenType {
        return TokenType.booleanConstant;
    }

    public castTo(value: NewValue, type: Type): NewValue {

        if (type == stringPrimitiveType) {
            return "" + <number>value;
        }

    }


    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        let value = <boolean>(firstOperand);

        switch (operation) {
            case TokenType.plus:
                return value + <string>(secondOperand);

            case TokenType.equal:
                return value == <boolean>(secondOperand);

            case TokenType.notEqual:
                return value != <boolean>(secondOperand);

            case TokenType.and:
                return value && <boolean>(secondOperand);

            case TokenType.or:
                return value || <boolean>(secondOperand);

            case TokenType.not:
                return !value;

        }


    }

    public debugOutput(value: NewValue): string {
        return "" + <boolean>value;
    }


}

export class VoidPrimitiveType extends PrimitiveType {

    init() {

        this.initialValue = false;

        this.identifier = "void";

        this.description = "leerer Rückgabewert"

        this.operationTable = {
        };

        this.canCastToMap = {};

    }

    public toTokenType(): TokenType {
        return TokenType.keywordVoid;
    }

    public castTo(value: NewValue, type: Type): NewValue {

        return value;

    }


    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        return null;

    }

    public debugOutput(value: NewValue): string {
        return "void";
    }


}

export class StringPrimitiveType extends Klass {

    private operationTable: { [operation: number]: { [typename: string]: Type } }

    public toTokenType(): TokenType {
        return TokenType.stringConstant;
    }

    public getResultType(operation: TokenType, secondOperandType?: Type): Type {

        if (operation == TokenType.keywordInstanceof) {
            return super.getResultType(operation, secondOperandType);
        }

        let opTypeMap = this.operationTable[operation];

        if (opTypeMap == null) {
            return null; // Operation not possible
        }

        if (secondOperandType != null) {
            return opTypeMap[secondOperandType.identifier];
        }

        return opTypeMap["none"];

    }


    constructor(baseClass: Klass) {
        super("String", null, "Ein Objekt der Klasse String speichert eine Zeichenkette.");
        this.baseClass = baseClass;
        let stringClass = this;
        baseClass.methods.filter(m => m.identifier == "toString").forEach(m => m.returnType = stringClass);
    }

    init() {
        this.operationTable = {
            [TokenType.plus]: {
                "String": stringPrimitiveType, "int": stringPrimitiveType,
                "float": stringPrimitiveType, "double": doublePrimitiveType,
                "boolean": stringPrimitiveType, "char": stringPrimitiveType
            },
            [TokenType.equal]: { "String": booleanPrimitiveType, "null": booleanPrimitiveType },
            [TokenType.notEqual]: { "String": booleanPrimitiveType, "null": booleanPrimitiveType },
            [TokenType.lower]: { "String": booleanPrimitiveType },
            [TokenType.greater]: { "String": booleanPrimitiveType },
            [TokenType.lowerOrEqual]: { "String": booleanPrimitiveType },
            [TokenType.greaterOrEqual]: { "String": booleanPrimitiveType }

        };


        this.addMethod(new Method("length", new Parameterlist([]), intPrimitiveType,
            (parameters) => { return (<string>parameters[0]).length; }, false, false, "Länge der Zeichenkette, d.h. Anzahl der Zeichen in der Zeichenkette."));
        this.addMethod(new Method("charAt", new Parameterlist([{ identifier: "Position", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), charPrimitiveType,
            (parameters) => { return (<string>parameters[0]).charAt(<number>(parameters[1])); }, false, false, "Zeichen an der gegebenen Position.\n**Bem.: ** Position == 0 bedeutet das erste Zeichen in der Zeichenkette, Position == 1 das zweite usw. ."));
        this.addMethod(new Method("equals", new Parameterlist([{ identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), booleanPrimitiveType,
            (parameters) => { return <string>parameters[0] == <string>(parameters[1]); }, false, false, "Gibt genau dann **wahr** zurück, wenn die zwei Zeichenketten übereinstimmen (unter Berücksichtigung von Klein-/Großschreibung)."));
        this.addMethod(new Method("compareTo", new Parameterlist([{ identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), intPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).localeCompare(<string>(parameters[1]), 'de', { caseFirst: 'upper' }); }, false, false, "Vergleicht den String mit dem übergebenen String. Gibt -1 zurück, falls ersterer im Alphabet vor letzterem steht, +1, falls umgekehrt und 0, falls beide Strings identisch sind."));
        this.addMethod(new Method("compareToIgnoreCase", new Parameterlist([{ identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), intPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).localeCompare(<string>(parameters[1]), 'de', { sensitivity: "accent" }); }, false, false, "Vergleicht den String mit dem übergebenen String. Gibt -1 zurück, falls ersterer im Alphabet vor letzterem steht, +1, falls umgekehrt und 0, falls beide Strings identisch sind."));
        this.addMethod(new Method("equalsIgnoreCase", new Parameterlist([{ identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), booleanPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).toLowerCase() == (<string>parameters[1]).toLowerCase(); }, false, false, "Gibt genau dann **wahr** zurück, wenn die zwei Zeichenketten übereinstimmen (**ohne** Berücksichtigung von Klein-/Großschreibung)."));
        this.addMethod(new Method("endsWith", new Parameterlist([{ identifier: "suffix", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), booleanPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).endsWith(<string>(parameters[1])); }, false, false, "Gibt genau dann **wahr** zurück, wenn die Zeichenkette mit der übergebenen Zeichenkette ( = suffix) endet. Klein-/Großschreibung wird dabei berücksichtigt!"));
        this.addMethod(new Method("startsWith", new Parameterlist([{ identifier: "präfix", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), booleanPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).startsWith(<string>(parameters[1])); }, false, false, "Gibt genau dann **wahr** zurück, wenn die Zeichenkette mit der übergebenen Zeichenkette ( = präfix) beginnt. Klein-/Großschreibung wird dabei berücksichtigt!"));
        this.addMethod(new Method("toLowerCase", new Parameterlist([]), stringPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).toLocaleLowerCase(); }, false, false, "Gibt die Zeichenkette zurück, die sich ergibt, wenn man in der gegebenen Zeichnkette jeden Großbuchstaben durch den entsprechenden Kleinbuchstaben ersetzt.\n**Bemerkung: ** Die Methode verändert die Zeichenkette selbst nicht."));
        this.addMethod(new Method("toUpperCase", new Parameterlist([]), stringPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).toLocaleUpperCase(); }, false, false, "Gibt die Zeichenkette zurück, die sich ergibt, wenn man in der gegebenen Zeichnkette jeden Kleinbuchstaben durch den entsprechenden Großbuchstaben ersetzt.\n**Bemerkung: ** Die Methode verändert die Zeichenkette selbst nicht."));
        this.addMethod(new Method("substring", new Parameterlist([{ identifier: "beginIndex", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), stringPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).substring(<number>(parameters[1])); }, false, false, "Gibt das hintere Ende der Zeichenkette ab **beginIndex** zurück. **beginIndex** == 1 bedeutet, dass die Zeichenkette ab dem 2.(!) Zeichen zurückgegeben wird. "));
        this.addMethod(new Method("substring", new Parameterlist([{ identifier: "beginIndex", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        { identifier: "endIndex", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), stringPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).substring(<number>(parameters[1]), <number>(parameters[2])); }, false, false, "Gibt die Teil-Zeichenkette von **beginIndex** bis **endIndex** zurück.\n**Vorsicht: ** beginIndex und endIndex sind nullbasiert, d.h. beginIndex == 0 bedeutet die Position vor dem ersten Zeichen."));
        this.addMethod(new Method("trim", new Parameterlist([]), stringPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).trim(); }, false, false, "Gibt die Zeichenkette zurück, die entsteht, wenn man am Anfang und Ende der Zeichenkette alle Leerzeichen, Tabs und Zeilenumbrüche entfernt."));
        this.addMethod(new Method("isEmpty", new Parameterlist([]), booleanPrimitiveType,
            (parameters) => { return (<string>(parameters[0])) == ""; }, false, false, "Gibt genau dann wahr zurück, wenn die Zeichenkette leer ist.\n**Warnung: ** Die Methode darf nicht mit dem '''null'''-Objekt aufgerufen werden!"));
        this.addMethod(new Method("indexOf", new Parameterlist([{ identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), intPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).indexOf(<string>(parameters[1])); }, false, false, "Gibt die erste Position zurück, an der **otherString** in der Zeichenkette gefunden wird."));
        this.addMethod(new Method("indexOf", new Parameterlist([
            { identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
            { identifier: "fromIndex", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        ]), intPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).indexOf(<string>(parameters[1]), <number>(parameters[2])); }, false, false, "Gibt die erste Position zurück, an der **otherString** in der Zeichenkette gefunden wird. Dabei wird erst bei fromIndex mit der Suche begonnen."));
        this.addMethod(new Method("lastIndexOf", new Parameterlist([{ identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false }]), intPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).lastIndexOf(<string>(parameters[1])); }, false, false, "Gibt die letzte Position zurück, bei der otherString in der Zeichenkette gefunden wird."));
        this.addMethod(new Method("lastIndexOf", new Parameterlist([
            { identifier: "otherString", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
            { identifier: "fromIndex", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        ]), intPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).lastIndexOf(<string>(parameters[1]), <number>(parameters[2])); }, false, false, "Gibt die letzte Position zurück, bei der otherString in der Zeichenkette gefunden wird. Dabei wird erst bei fromIndex - von rechts her beginnend - gesucht."));
        this.addMethod(new Method("replace", new Parameterlist([
            { identifier: "target", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
            { identifier: "replacement", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        ]), stringPrimitiveType,
            (parameters) => { return (<string>(parameters[0])).replace(<string>(parameters[1]), <string>(parameters[2])); }, false, false, "Ersetzt alle Vorkommen von **target** durch **replacement** und gibt die entstandene Zeichenkette zurück. Die Zeichenkette selbst wird nicht verändert."));
        this.addMethod(new Method("replaceAll", new Parameterlist([
            { identifier: "regex", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
            { identifier: "replacement", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        ]), stringPrimitiveType,
            (parameters) => {
                let pattern = <string>(parameters[1]);
                let regExp = new RegExp(pattern, 'g');

                return (<string>(parameters[0])).replace(regExp, <string>(parameters[2]));
            }, false, false, "Durchsucht den String mit dem regulären Ausdruck (regex) und ersetzt **alle** Fundstellen durch **replacement**."));
        this.addMethod(new Method("replaceFirst", new Parameterlist([
            { identifier: "regex", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
            { identifier: "replacement", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        ]), stringPrimitiveType,
            (parameters) => {
                let pattern = <string>(parameters[1]);
                let regExp = new RegExp(pattern, '');

                return (<string>(parameters[0])).replace(regExp, <string>(parameters[2]));
            }, false, false, "Durchsucht den String mit dem regulären Ausdruck (regex) und ersetzt **die erste** Fundstelle durch **replacement**."));
        this.addMethod(new Method("split", new Parameterlist([
            { identifier: "regex", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: false },
        ]), new ArrayType(stringPrimitiveType),
            (parameters) => {
                let pattern = <string>(parameters[1]);
                let regExp = new RegExp(pattern, '');

                let strings = (<string>(parameters[0])).split(regExp);
                let values: NewValue[] = [];
                for (let s of strings) {
                    values.push(s);
                }

                return values;

            }, false, false, "Teilt die Zeichenkette an den Stellen, die durch den regulären Ausdruck (regex) definiert sind, in Teile auf. Die Fundstellen des regex werden dabei weggelassen. Gibt die Teile als String-Array zurück."));

    }

    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        let value = <string>(firstOperand);

        switch (operation) {
            case TokenType.plus:
                if (typeof secondOperand == "string") {
                    return value + <string>(secondOperand);
                } else if (typeof secondOperand == "boolean") {
                    return value + <boolean>(secondOperand);
                } else {
                    return value + <number>(secondOperand);
                }

            case TokenType.lower:
                return value.localeCompare(<string>(secondOperand), 'de', { caseFirst: 'upper' }) < 0;
                // return value < (<string>(secondOperand));

            case TokenType.greater:
                return value.localeCompare(<string>(secondOperand), 'de', { caseFirst: 'upper' }) > 0;
                // return value > <string>(secondOperand);

            case TokenType.lowerOrEqual:
                return value.localeCompare(<string>(secondOperand), 'de', { caseFirst: 'upper' }) <= 0;
                // return value <= <string>(secondOperand);

            case TokenType.greaterOrEqual:
                return value.localeCompare(<string>(secondOperand), 'de', { caseFirst: 'upper' }) >= 0;
                // return value >= <string>(secondOperand);

            case TokenType.equal:
                return value == <string>(secondOperand);

            case TokenType.notEqual:
                return value != <string>(secondOperand);

            case TokenType.keywordInstanceof:
                return super.compute(operation, firstOperand, secondOperand);

        }


    }

    public debugOutput(value: NewValue): string {
        return '"' + <string>value + '"';
    }


}

export class CharPrimitiveType extends PrimitiveType {

    init() {

        this.initialValue = "\u0000";

        this.identifier = "char";

        this.description = "ein Zeichen"

        this.operationTable = {
            [TokenType.plus]: { "String": stringPrimitiveType, "char": stringPrimitiveType },
            [TokenType.equal]: { "char": booleanPrimitiveType },
            [TokenType.notEqual]: { "char": booleanPrimitiveType },
            [TokenType.lower]: { "char": booleanPrimitiveType },
            [TokenType.greater]: { "char": booleanPrimitiveType },
            [TokenType.lowerOrEqual]: { "char": booleanPrimitiveType },
            [TokenType.greaterOrEqual]: { "char": booleanPrimitiveType }

        };

        // this.canCastTolist = [intPrimitiveType, floatPrimitiveType, doublePrimitiveType, stringPrimitiveType];
        this.canCastToMap = {
            "int": { automatic: true, needsStatement: true },
            "float": { automatic: true, needsStatement: true },
            "double": { automatic: true, needsStatement: true },
            "String": { automatic: true, needsStatement: false },
            "char": { automatic: true, needsStatement: false },
            "Character": { automatic: true, needsStatement: false },
        }

    }

    public toTokenType(): TokenType {
        return TokenType.charConstant;
    }

    public castTo(value: NewValue, type: Type): NewValue {

        if (type == stringPrimitiveType) {
            return value;
        }

        if (type == intPrimitiveType || type == floatPrimitiveType || type == doublePrimitiveType) {
            return (<string>value).charCodeAt(0);
        }

    }

    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        let value = <string>(firstOperand);

        switch (operation) {
            case TokenType.plus:
                return value + <string>(secondOperand);

            case TokenType.lower:
                return value < (<string>(secondOperand));

            case TokenType.greater:
                return value > <string>(secondOperand);

            case TokenType.lowerOrEqual:
                return value <= <string>(secondOperand);

            case TokenType.greaterOrEqual:
                return value >= <string>(secondOperand);

            case TokenType.equal:
                return value == <string>(secondOperand);

            case TokenType.notEqual:
                return value != <string>(secondOperand);

        }


    }

    public debugOutput(value: NewValue): string {
        return "'" + <string>value + "'";
    }


}

export var voidPrimitiveType = new VoidPrimitiveType();
export var intPrimitiveType = new IntPrimitiveType();
export var floatPrimitiveType = new FloatPrimitiveType();
export var doublePrimitiveType = new DoublePrimitiveType();
export var booleanPrimitiveType = new BooleanPrimitiveType();
setBooleanPrimitiveTypeCopy(booleanPrimitiveType);
export var objectType = new ObjectClass(null);
export var stringPrimitiveType = new StringPrimitiveType(objectType);
export var charPrimitiveType = new CharPrimitiveType();
export var nullType = new NullType();
export var varType = new VarType();

export var IntegerType = new IntegerClass(objectType);
export var FloatType = new FloatClass(objectType);
export var DoubleType = new DoubleClass(objectType);
export var CharacterType = new CharacterClass(objectType);
export var BooleanType = new BooleanClass(objectType);

export var TokenTypeToDataTypeMap: { [tt: number]: Type } = {
    [TokenType.integerConstant]: intPrimitiveType,
    [TokenType.floatingPointConstant]: floatPrimitiveType,
    [TokenType.booleanConstant]: booleanPrimitiveType,
    [TokenType.stringConstant]: stringPrimitiveType,
    [TokenType.charConstant]: charPrimitiveType,
    [TokenType.keywordNull]: nullType
}

export function getType(v: any): Type {
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
