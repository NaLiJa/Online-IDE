import { TextPosition, TokenType } from "../../compiler/lexer/Token.js";
import { Module } from "../../compiler/parser/Module.js";
import { Program, Statement } from "../../compiler/parser/Program.js";
import { Interface, Klass } from "../../compiler/types/Class.js";
import { Enum } from "../../compiler/types/Enum.js";
import { booleanPrimitiveType, getType, stringPrimitiveType, StringPrimitiveType, voidPrimitiveType } from "../../compiler/types/PrimitiveTypes.js";
import { Method, NewValue, Parameterlist, PrimitiveType, Value } from "../../compiler/types/Types.js";
import { Interpreter } from "../../interpreter/Interpreter.js";
import { RuntimeObject } from "../../interpreter/RuntimeObject.js";
import { ListHelper } from "./ArrayList.js";


export class MapHelper {

    keyArray: NewValue[] = [];
    valueArray: NewValue[] = [];

    map: Map<any, NewValue> = new Map(); // Maps key objects to value-Values

    constructor(private runtimeObject: RuntimeObject, public interpreter: Interpreter, private module: Module) {
    }

    get(key: NewValue){
        return this.map.get(key);
    }

    set(key: NewValue, value: NewValue): NewValue {

        let old = this.map.get(key);

        if(old == null){
            this.keyArray.push(key);
        } else {
            this.valueArray.splice(this.valueArray.indexOf(old), 1);
        }

        this.valueArray.push(value);
        
        this.map.set(key, value);

        return old;

    }

    allElementsPrimitive(): boolean {
        for (let v of this.keyArray) {
            let type = getType(v);
            if (!(type instanceof PrimitiveType || ["String", "_Double", "Integer", "Boolean" ,"Character"].indexOf(type.identifier) >= 0)) {
                return false;
            }
        }
        for (let v of this.valueArray) {
            let type = getType(v);
            if (!(type instanceof PrimitiveType || ["String", "_Double", "Integer", "Boolean" ,"Character"].indexOf(type.identifier) >= 0)) {
                return false;
            }
        }
        return true;
    }

    to_String(): any {

        if (this.allElementsPrimitive()) {
            let s = "[";
            for (let i = 0; i < this.keyArray.length; i++) {
                s += "" + this.keyArray[i] + " => " + this.valueArray[i];
                if (i < this.keyArray.length - 1) s += ", ";
            }

            return s + "]";
        }

        let position: TextPosition = {
            line: 1,
            column: 1,
            length: 1
        }

        let statements: Statement[] = [
            {
                type: TokenType.noOp,
                position: position,
                stepFinished: false
            },
            {
                type: TokenType.pushConstant,
                dataType: stringPrimitiveType,
                value: "[",
                position: position,
                stepFinished: false
            },
        ];

        let toStringParameters = new Parameterlist([]);

        for (let i = 0; i < this.valueArray.length; i++) {

            let key = this.keyArray[i];
            let type = getType(key);
            if (type instanceof PrimitiveType || type instanceof StringPrimitiveType) {
                statements.push({
                    type: TokenType.pushConstant,
                    dataType: stringPrimitiveType,
                    value: type.castTo(key, stringPrimitiveType),
                    position: position,
                    stepFinished: false
                });
            } else {
                statements.push({
                    type: TokenType.pushConstant,
                    dataType: type,
                    value: key,
                    stepFinished: false,
                    position: position
                });
                statements.push({
                    type: TokenType.callMethod,
                    method: (<Klass | Interface | Enum>type).getMethod("toString", toStringParameters),
                    isSuperCall: false,
                    stackframeBegin: -1,
                    stepFinished: false,
                    position: position
                });

            }

            statements.push({
                type: TokenType.binaryOp,
                operator: TokenType.plus,
                leftType: stringPrimitiveType,
                stepFinished: false,
                position: position
            });

            statements.push({
                type: TokenType.pushConstant,
                dataType: stringPrimitiveType,
                value: " => ",
                position: position,
                stepFinished: false
            });
            statements.push({
                type: TokenType.binaryOp,
                operator: TokenType.plus,
                leftType: stringPrimitiveType,
                stepFinished: false,
                position: position
            });


            let value = this.valueArray[i];
            type = getType(value);
            if (value == null || type instanceof PrimitiveType || type instanceof StringPrimitiveType) {
                statements.push({
                    type: TokenType.pushConstant,
                    dataType: stringPrimitiveType,
                    value: value == null ? "null" : type.castTo(value, stringPrimitiveType),
                    position: position,
                    stepFinished: false
                });
            } else {
                statements.push({
                    type: TokenType.pushConstant,
                    dataType: type,
                    value: value,
                    stepFinished: false,
                    position: position
                });
                statements.push({
                    type: TokenType.callMethod,
                    method: (<Klass | Interface | Enum>type).getMethod("toString", toStringParameters),
                    isSuperCall: false,
                    stackframeBegin: -1,
                    stepFinished: false,
                    position: position
                });

            }

            statements.push({
                type: TokenType.binaryOp,
                operator: TokenType.plus,
                leftType: stringPrimitiveType,
                stepFinished: false,
                position: position
            });

            if (i < this.valueArray.length - 1) {
                statements.push({
                    type: TokenType.pushConstant,
                    dataType: stringPrimitiveType,
                    value: ", ",
                    position: position,
                    stepFinished: false
                });
                statements.push({
                    type: TokenType.binaryOp,
                    leftType: stringPrimitiveType,
                    operator: TokenType.plus,
                    stepFinished: false,
                    position: position
                });

            }

        }

        statements.push({
            type: TokenType.pushConstant,
            dataType: stringPrimitiveType,
            value: "]",
            position: position,
            stepFinished: false
        });

        statements.push({
            type: TokenType.binaryOp,
            operator: TokenType.plus,
            leftType: stringPrimitiveType,
            stepFinished: false,
            position: position
        });

        // statements.push({
        //     type: TokenType.binaryOp,
        //     operator: TokenType.plus,
        //     leftType: stringPrimitiveType,
        //     stepFinished: false,
        //     position: position
        // });

        statements.push({
            type: TokenType.return,
            copyReturnValueToStackframePos0: true,
            leaveThisObjectOnStack: false,
            stepFinished: false,
            position: position,
            methodWasInjected: true
        });

        let program: Program = {
            module: this.module,
            statements: statements,
            labelManager: null
        }

        let method: Method = new Method("toString", new Parameterlist([]), stringPrimitiveType, program, false, false);
        this.interpreter.runTimer(method, [], () => console.log("List.toString fertig!"), true)

        return "";
    }

    size(): number {
        return this.valueArray.length;
    }

    isEmpty(): boolean {
        return this.valueArray.length == 0;
    }

    containsKey(key: NewValue): any {
        return this.map.get(key) != null;
    }

    containsValue(value: NewValue): any {
        for(let v of this.valueArray){
            if(v == value) return true;
        }
        return false;
    }

    clear() {
        this.valueArray = [];
        this.keyArray = [];
        this.map.clear();
    }

}
