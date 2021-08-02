import { Module } from "../compiler/parser/Module.js";
import { Klass, Visibility } from "../compiler/types/Class.js";
import { doublePrimitiveType, intPrimitiveType, stringPrimitiveType } from "../compiler/types/PrimitiveTypes.js";
import { Attribute, Method, Parameterlist, Value } from "../compiler/types/Types.js";
import { RuntimeObject } from "../interpreter/RuntimeObject.js";

export class RandomClass extends Klass {

    constructor(module: Module) {

        super("Random", module, "Zufallszahlengenerator");

        this.setBaseClass(<Klass>module.typeStore.getType("Object"));

        this.setupAttributeIndicesRecursive();


        this.addMethod(new Method("nextInt", new Parameterlist([
            { identifier: "bound", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true, isEllipsis: false },
        ]), intPrimitiveType,
            (parameters) => {

                let o: RuntimeObject = <RuntimeObject>parameters[0];
                let bound: number = <number>parameters[1];

                return Math.floor(Math.random()*bound);

            }, false, false, 'Gibt eine ganzzahlige Zufallszahl aus der Menge {0, 1, ..., bound - 1} zurück.', false));

        this.addMethod(new Method("randint", new Parameterlist([
            { identifier: "from", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true, isEllipsis: false },
            { identifier: "to", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true, isEllipsis: false },
        ]), intPrimitiveType,
            (parameters) => {

                let from: number = <number>parameters[1];
                let to: number = <number>parameters[2];

                return Math.floor(Math.random()*(to - from + 1) + from);

            }, false, true, 'Gibt eine ganzzahlige Zufallszahl aus der Menge {from, from + 1, ..., to} zurück.', false));

        this.addMethod(new Method("randdouble", new Parameterlist([
            { identifier: "from", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true, isEllipsis: false },
            { identifier: "to", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true, isEllipsis: false },
        ]), doublePrimitiveType,
            (parameters) => {

                let from: number = <number>parameters[1];
                let to: number = <number>parameters[2];

                return Math.random()*(to - from) + from;

            }, false, true, 'Gibt eine Zufallszahl aus dem Intervall [from, to[ zurück.', false));



    }

}


