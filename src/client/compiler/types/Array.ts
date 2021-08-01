import { Method, Attribute, Value, Type, Parameterlist, PrimitiveType, NewValue } from "./Types.js";
import { TokenType } from "../lexer/Token.js";
import { intPrimitiveType } from "./PrimitiveTypes.js";
import { Visibility } from "./Class.js";

export class ArrayType extends Type {

    public arrayOfType: Type;
    private lengthAttribute: Attribute;

    constructor(arrayOfType: Type){
        super();
        this.arrayOfType = arrayOfType;
        this.identifier = "Array";

        if(arrayOfType != null){
            this.identifier = arrayOfType.identifier + "[]";
        }

        this.lengthAttribute = new Attribute("length", intPrimitiveType, (object: Value) => {
            return (<any[]>object.value).length;
        }, false, Visibility.public, true);
    }   

    public equals(type:Type): boolean{
        return (type instanceof ArrayType) && type.arrayOfType.equals(this.arrayOfType);
    }

    public get id():string{
        return this.arrayOfType.identifier + "[]";
    }

    public getResultType(operation: TokenType, secondOperandType?: Type): Type {
        if(operation == TokenType.referenceElement){
            return this.arrayOfType;
        }

        return null;

    }

    public compute(operation: TokenType, firstOperand: NewValue, secondOperand?: NewValue): any {

        if(operation == TokenType.referenceElement){
            return <any[]>firstOperand[<number>secondOperand];
        }

    }

    public getMethod(identifier: string, signature: Parameterlist): Method{
        return null;
    }

    public getAttribute(identifier: string): Attribute{
        if(identifier == "length"){
            return this.lengthAttribute;
        }
        return null;
    }

    public canCastTo(type: Type): boolean{

        if(!(type instanceof ArrayType)){
            return false;
        }

        return this.arrayOfType.canCastTo(type.arrayOfType);
    }

    public castTo(value: NewValue, type: Type): NewValue {

        let array = (<NewValue[]>value).slice();
        let destType = (<ArrayType><unknown>type).arrayOfType;

        for(let a of array){
            this.arrayOfType.castTo(a, destType);
        }

        return array;

    }

    public debugOutput(value: NewValue, maxLength: number = 40):string {

        let length: number = 0;

        if(value != null){

            let s: string = "[";

                let a: NewValue[] = <NewValue[]>value;

                for(let i = 0; i < a.length; i++){

                    let v = a[i];

                    let s1 = this.arrayOfType.debugOutput(v, maxLength/2);

                    s += s1;
                    if(i < a.length - 1) s += ",&nbsp;";
                    length += s1.length;

                    if(length > maxLength) break;

                }

            return s + "]"

        } else return "null";


    }


}
