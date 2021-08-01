import { Klass, StaticClass, Visibility } from "../compiler/types/Class.js";
import { PrimitiveType, Value } from "../compiler/types/Types.js";



export class RuntimeObject {

    class: Klass | StaticClass;

    intrinsicData: { [classIdentifier: string]: any } = {};  // for intrinsic (= builtin) classes to store data

    // Attributes of class and base-classes
    attributes: any[];

    constructor(klass: Klass | StaticClass) {

        this.class = klass;

        this.initializeAttributeValues();

    }

    getValue(attributeIndex: number): any {

        return this.attributes[attributeIndex];

    }

    private initializeAttributeValues() {

        if (this.class instanceof Klass) {
            this.attributes = this.class.attributeTemplates.slice(0);
        } else {

            this.attributes = Array(this.class.numberOfAttributesIncludingBaseClass).fill(null);

            let klass = this.class;
            while (klass != null) {

                for (let att of klass.attributes) {

                    if (att.type instanceof PrimitiveType) {
                        this.attributes[att.index] = att.type.initialValue;
                    }

                }

                klass = klass.baseClass;
            }
        }


    }

}


export function deepCopy(obj: any): any {

    var copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");

}

