import { Program } from "../parser/Program.js";
import { Klass, Visibility } from "./Class.js";
import { Value, Attribute, Method, Parameterlist, Type, NewValue } from "./Types.js";
import { Module } from "../parser/Module.js";
import { RuntimeObject } from "../../interpreter/RuntimeObject.js";
import { ArrayType } from "./Array.js";
import { TextPosition } from "../lexer/Token.js";
import { EnumValueNode } from "../parser/AST.js";
import { stringPrimitiveType, intPrimitiveType, objectType } from "./PrimitiveTypes.js";

export class EnumRuntimeObject extends RuntimeObject {

    enumValue: EnumInfo;

    constructor(en: Enum, enumValue: EnumInfo) {
        super(en);
        this.enumValue = enumValue;
    }

}

export type EnumInfo = {
    identifier: string,
    ordinal: number,
    position?: TextPosition,
    object?: EnumRuntimeObject,
    constructorCallProgram?: Program
}


export class Enum extends Klass {

    enumInfoList: EnumInfo[] = [];
    identifierToInfoMap: { [identifier: string]: EnumInfo } = {};
    indexToInfoMap: { [index: number]: EnumInfo } = {};

    valueList: RuntimeObject[] = null;

    getOrdinal(valueIdentifier: string): number {

        let enumInfo: EnumInfo = this.identifierToInfoMap[valueIdentifier];
        if (enumInfo == null) return -1;
        return enumInfo.ordinal;

    }

    public debugOutput(value: NewValue, maxLength: number = 40): string {
        let enumObject = <EnumRuntimeObject>value;
        return this.identifier + "." + enumObject.enumValue.identifier;
    }

    constructor(identifier: string, module: Module, enumValueNodes: EnumValueNode[]) {

        super(identifier, module);
        this.baseClass = objectType;

        let i: number = 0;

        for (let evn of enumValueNodes) {

            let attribute: Attribute = new Attribute(evn.identifier, this, null, true, Visibility.public, true);

            if (evn.position != null) {
                attribute.declaration = {
                    module: module,
                    position: evn.position
                }

                attribute.usagePositions.set(module, [evn.position]);
            }

            this.staticClass.addAttribute(
                attribute
            );


            let ev: EnumInfo = {
                identifier: evn.identifier,
                ordinal: i++
            }

            this.enumInfoList.push(ev);
            this.identifierToInfoMap[evn.identifier] = ev;
            this.indexToInfoMap[ev.ordinal] = ev;

        }

        if(module.isSystemModule){
            this.valueList = [];
            for(let ei of this.enumInfoList){

                ei.object = new EnumRuntimeObject(this, ei);

                this.valueList.push(ei.object)
            }
        }

        let that = this;

        this.staticClass.addMethod(new Method("getValues",
            new Parameterlist([]), new ArrayType(this), (parameters: NewValue[]) => {

                if (this.valueList == null) {

                    let values = [];
                    for (let vi of this.enumInfoList) {

                        values.push(vi.object);

                    }

                    this.valueList = values;

                }

                return this.valueList;

            }, false, true)
        );

        this.addMethod(new Method("toString",
            new Parameterlist([]), stringPrimitiveType, (parameters: NewValue[]) => {

                let erto: EnumRuntimeObject = <EnumRuntimeObject>(parameters[0]);

                return erto.enumValue.identifier;

            }, false, false)
        );

        this.addMethod(new Method("toOrdinal",
            new Parameterlist([]), intPrimitiveType, (parameters: NewValue[]) => {

                let erto: EnumRuntimeObject = <EnumRuntimeObject>(parameters[0]);

                return erto.enumValue.ordinal;

            }, false, false)
        );

    }

    public canCastTo(type: Type): boolean {

        if (type == intPrimitiveType) {
            return true;
        }

        return super.canCastTo(type);

    }

    public castTo(value: NewValue, type: Type): NewValue {

        if (type == intPrimitiveType) {
            let en = <EnumRuntimeObject>value;
            return en.enumValue.ordinal;
        }

        return super.castTo(value, type);
    }


}
