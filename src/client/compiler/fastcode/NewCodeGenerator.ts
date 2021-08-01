import { Error } from "../lexer/Lexer.js";
import { TextPosition, TokenType } from "../lexer/Token.js";
import { ArrayType } from "../types/Array.js";
import { StaticClass } from "../types/Class.js";
import { stringPrimitiveType } from "../types/PrimitiveTypes.js";
import { Heap, Method, Type } from "../types/Types.js";
import { ASTNode } from "../parser/AST.js";
import { Module, ModuleStore } from "../parser/Module.js";
import { NewProgram, NewStep } from "./NewProgram.js";
import { SymbolTable } from "../parser/SymbolTable.js";


type Term = {
    type: Type;
    initialSteps: NewStep;
    
}


export class NewCodeGenerator {

    static assignmentOperators = [TokenType.assignment, TokenType.plusAssignment, TokenType.minusAssignment,
    TokenType.multiplicationAssignment, TokenType.divisionAssignment, TokenType.ANDAssigment, TokenType.ORAssigment,
    TokenType.XORAssigment, TokenType.shiftLeftAssigment, TokenType.shiftRightAssigment, TokenType.shiftRightUnsignedAssigment];

    moduleStore: ModuleStore;
    module: Module;

    symbolTableStack: SymbolTable[];
    currentSymbolTable: SymbolTable;

    heap: Heap;

    currentProgram: NewProgram;

    errorList: Error[];

    nextFreeRelativeStackPos: number;


    start(module: Module, moduleStore: ModuleStore) {

        this.moduleStore = moduleStore;
        this.module = module;

        this.symbolTableStack = [];
        this.currentSymbolTable = null;

        this.currentProgram = null;
        this.errorList = [];

        this.nextFreeRelativeStackPos = 0;

        if (this.module.tokenList.length > 0) {
            let lastToken = this.module.tokenList[this.module.tokenList.length - 1];
            this.module.mainSymbolTable.positionTo = { line: lastToken.position.line, column: lastToken.position.column + 1, length: 1 };
        }

        this.symbolTableStack.push(this.module.mainSymbolTable);
        this.currentSymbolTable = this.module.mainSymbolTable;

        this.generateMain();

        this.generateClasses();

        this.lookForStaticVoidMain();

        this.module.errors[3] = this.errorList;

    }

    lookForStaticVoidMain() {

        let mainProgram = this.module.newMainProgram;

        if (mainProgram != null && mainProgram.statements.length > 2) return;

        let mainMethod: Method = null;
        let staticClass: StaticClass = null;
        let classNode1: ASTNode;

        for (let classNode of this.module.classDefinitionsAST) {
            if (classNode.type == TokenType.keywordClass) {

                let ct = classNode.resolvedType;

                for (let m of ct.staticClass.methods) {
                    if (m.identifier == "main" && m.parameterlist.parameters.length == 1) {
                        let pt = m.parameterlist.parameters[0];
                        if (pt.type instanceof ArrayType && pt.type.arrayOfType == stringPrimitiveType) {
                            if (mainMethod != null) {
                                this.pushError("Es existieren mehrere Klassen mit statischen main-Methoden.", classNode.position);
                            } else {
                                mainMethod = m;
                                staticClass = ct.staticClass;
                                classNode1 = classNode;
                            }
                        }
                    }
                }
            }
        }

        if (mainMethod != null) {

            let position: TextPosition = mainMethod.usagePositions[0];
            if (mainMethod.program != null && mainMethod.program.statements.length > 0) {
                position = mainMethod.program.statements[0].position;
            }

            this.initCurrentProgram();

            this.module.newMainProgram = this.currentProgram;

            

            this.pushStatements([{
                type: TokenType.callMainMethod,
                position: position,
                stepFinished: false,
                method: mainMethod,
                staticClass: staticClass
            }, {
                type: TokenType.closeStackframe,
                position: mainMethod.usagePositions.get(this.module)[0]
            }
            ], false);

        }

    }

    initCurrentProgram() {

        this.currentProgram = {
            module: this.module,
            statements: [],
        };

    }


    pushError(text: string, position: TextPosition, errorLevel: ErrorLevel = "error", quickFix?: QuickFix) {
        this.errorList.push({
            text: text,
            position: position,
            quickFix: quickFix,
            level: errorLevel
        });
    }



}