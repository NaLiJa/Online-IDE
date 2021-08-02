import { Interpreter } from "../../interpreter/Interpreter.js";
import { RuntimeObject } from "../../interpreter/RuntimeObject.js";
import { ModuleStore } from "../parser/Module.js";
import { ArrayType } from "./Array.js";
import { Interface, Klass } from "./Class.js";
import { Enum, EnumRuntimeObject } from "./Enum.js";
import { getType } from "./PrimitiveTypes.js";
import { NewValue, PrimitiveType, Type, Value } from "./Types.js";

type SerializedObject = {
    "!k"?: string, // Class identifier or object index
    "!i": number  // index
}

export class JsonTool {
    // to deserialize:
    indexToObjectMap: { [index: number]: NewValue };
    valuesToResolve: { v: NewValue, i: number }[];

    // to serialize:
    objectToIndexMap: Map<RuntimeObject, number>;
    nextIndex: number;

    primitiveTypes: String[] = ["String", "Integer", "Double", "Boolean", "Float", "Character"];

    toJson(value: RuntimeObject): string {
        this.objectToIndexMap = new Map();
        this.nextIndex = 0;
        let json = JSON.stringify(this.toJsonObj(value));
        this.objectToIndexMap = null; // free memory
        return json;
    }

    toJsonObj(value: NewValue): any {
        let type = getType(value);
        if (value == null) return null;

        if ((type instanceof Klass || type instanceof Interface) && this.primitiveTypes.indexOf(type.identifier) < 0) {

            if (type instanceof Enum) {
                let enumObj = <EnumRuntimeObject>value;
                return enumObj.enumValue.ordinal;
            }

            let rto = <RuntimeObject>value;
            return this.objectToJsonObj(rto);
        } else if (type instanceof ArrayType) {
            let arrayValues: NewValue[] = <NewValue[]>value;
            return arrayValues.map(value => this.toJsonObj(value));
        } else {
            // primitive Type
            return value;
        }
    }

    objectToJsonObj(rto: RuntimeObject): SerializedObject {
        // We solve circular object references by serializing an index when the same object occurs more than once.
        let index = this.objectToIndexMap.get(rto);
        if (index != null) {
            return { "!i": index };
        }

        index = this.nextIndex++;
        this.objectToIndexMap.set(rto, index);
        let klass: Klass = <Klass>rto.class;

        let serializedObject: SerializedObject = { "!k": klass.identifier, "!i": index };
        // Don't serialize system classes unless they are explicitely serializable
        if (klass.module.isSystemModule) {
            return null;
        }

        while (klass != null) {
            let first: boolean = true;
            let serializedAttributes: any;
            for (let attribute of klass.attributes) {
                if (!attribute.isStatic && !attribute.isTransient) {
                    if (first) {
                        first = false;
                        serializedAttributes = {};
                        serializedObject[klass.identifier] = serializedAttributes;
                    }
                    serializedAttributes[attribute.identifier] = this.toJsonObj(rto.attributes[attribute.index]);
                }
            }

            klass = klass.baseClass;
        }

        return serializedObject;
    }

    fromJson(jsonString: string, type: Type, moduleStore: ModuleStore, interpreter: Interpreter): any {
        this.indexToObjectMap = {};
        this.valuesToResolve = [];

        let obj: any = JSON.parse(jsonString);
        let ret = this.fromJsonObj(obj, type, moduleStore, interpreter);

        for (let vtr of this.valuesToResolve) {
            let value = this.indexToObjectMap[vtr.i];
            if (value != null) {
                vtr.v = value;
            }
        }

        this.indexToObjectMap = null; // free memory
        this.valuesToResolve = null;
        return ret;
    }

    fromJsonObj(obj: any, type: Type, moduleStore: ModuleStore, interpreter: Interpreter): NewValue {
        if (obj == null) return null;

        if ((type instanceof Klass || type instanceof Interface) && this.primitiveTypes.indexOf(type.identifier) < 0) {

            if (type instanceof Enum) {
                return type.indexToInfoMap[obj].object
            }

            let serializedObject = <SerializedObject>obj;
            return this.objectFromJsonObj(serializedObject, type, moduleStore, interpreter);

        } else if (type instanceof ArrayType) {
            let jsonArray: any[] = obj;
            return jsonArray.map(v => this.fromJsonObj(v, type.arrayOfType, moduleStore, interpreter))
        } else {
            // primitive Type
            return obj 
        }

    }

    objectFromJsonObj(serializedObject: SerializedObject, type: Klass | Interface, moduleStore: ModuleStore,
        interpreter: Interpreter): NewValue {

        let identifier: string = serializedObject["!k"];
        let index = serializedObject["!i"];
        if (identifier != null) {

            let klass1: Klass = <Klass>moduleStore.getType(identifier).type;
            let klass = klass1;

            let rto: RuntimeObject = interpreter.instantiateObjectImmediately(klass);

            while (klass != null) {
                let attributes = rto.attributes;
                let serializedAttributes = serializedObject[klass.identifier];
                if (attributes != null && serializedObject != null) {
                    for (let attribute of klass.attributes) {
                        if (!attribute.isStatic && !attribute.isTransient) {
                            attributes[attribute.index] = this.fromJsonObj(serializedAttributes[attribute.identifier], attribute.type, moduleStore, interpreter);
                        }
                    }
                }

                klass = klass.baseClass;
            }

            let value: NewValue = rto;
            this.indexToObjectMap[index] = value;
            return value;

        } else {
            let index = serializedObject["!i"];
            let value = this.indexToObjectMap[index];
            if (value == null) {
                this.valuesToResolve.push({ v: value, i: index });
                return value;
            } else {
                return value; // return copy
            }
        }

    }



}


