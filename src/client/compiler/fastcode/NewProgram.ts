import { TextPosition } from "../lexer/Token.js";
import { Method } from "../types/Types.js";
import { Module } from "../parser/Module.js";
import { Klass, StaticClass } from "../types/Class.js";


export type NewRuntimeError = {
    message: string;
}

export type NewThread = {
    programStack: NewProgram[];
    currentProgram: NewProgram;
    pc: number;
    pcStack: number[];
    stack: any[];
    stackframes: number[];
    process: any;
    classes: {[identifier: string]: Klass};                 // points to process.classes
    staticClasses: {[identifier: string]: StaticClass};     // points to process.staticClasses
};

/**
 * let step = new Function('stack', 'runtime', '... thread.pc += 7; return null');
 * heap is accessed by thread.process.heap
 * classes are accessed by thread.classes[identifier]
 * static classes are accessed by thread.staticClasses[identifier]
 */
export type NewStep = (stack: any[], thread: NewThread) => NewRuntimeError;


export type NewStatement = {

    programText: string;
    step: NewStep;
    position: TextPosition;

    // Additionally: 
    // "p_1": Program, "p_2": Program, ... for programs calles


}

/**
 * Main Program or Method
 */
export class NewProgram  {

    statements: NewStatement[];
    module: Module;
    method?: Method; // used for stacktrace

}




