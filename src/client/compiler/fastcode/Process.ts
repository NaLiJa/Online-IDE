import { Klass, StaticClass } from "../types/Class.js";
import { NewThread } from "./NewProgram.js";



class Process {

    threads: NewThread[] = [];

    classes: {[identifier: string]: Klass} = {};
    staticClasses: {[identifier: string]: StaticClass}



}