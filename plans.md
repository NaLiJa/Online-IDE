# Neuer Compiler
## Neue Objektstruktur
 - RuntimeObject:
```typescript
type RuntimeObject = {
    __attributeValues: any[],         // for all attributes including those of base classes
}
```
Der Prototyp des RuntimeObjects ist die dazugehörige RuntimeClass:
```typescript
type RuntimeClass = {
    methodIdentifier1: Program, // only for given class; base class methods are part of prototype-attribute
    methodIdentifier2: Program,
    __class: Klass
}
```
Diese wiederum hat als Prototypen ihre Basisklasse usw.
### Snippets zur praktischen Umsetzung:
```javascript
let BaseClass1 = {method1: "Method1", method2: "Method2"};
let BaseClass2 = Object.create(BaseClass1);
BaseClass2["method1"] = "Method1Overwritten";
let BaseClass3 = Object.create(BaseClass2);
BaseClass3["method3"] = "Method3";

Object.getPrototypeOf(BaseClass3) === BaseClass2;
BaseClass1.isPrototypeOf(BaseClass3) === true;
Object.getPrototypeOf(BaseClass1)
{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
```

 - `type Value` entfällt komplett; Werte werden direkt gespeichert
## Speichern von Programmen:
```typescript
type Step = {
    cursorPosition: TextPosition,   // Position vor Ausführung des Steps
    codeOneStep: String[],
    codeMultipleSteps: String[]?,
    numberOfSteps: number?,     // in codeMultipleSteps 
    functionOneStep: (interpreter: Interpreter, ownStack: any[], globalStack: any[]): void,
    functionMultipleSteps: (interpreter: Interpreter, ownStack: any[], globalStack: any[]): void,
};

type Program = {
    steps: Step[]
}
```
## Codebeispiele




### Polyfill für Object.create
```javascript
if (typeof Object.create != 'function') {
  Object.create = (function(undefined) {
    var Temp = function() {};
    return function (prototype, propertiesObject) {
      if(prototype !== Object(prototype) && prototype !== null) {
        throw TypeError('Argument must be an object, or null');
      }
      Temp.prototype = prototype || {};
      if (propertiesObject !== undefined) {
        Object.defineProperties(Temp.prototype, propertiesObject);
      }
      var result = new Temp();
      Temp.prototype = null;
      // to imitate the case of Object.create(null)
      if(prototype === null) {
         result.__proto__ = null;
      }
      return result;
    };
  })();
}
```



### Instantiate Objects by class name
https://www.stevefenton.co.uk/2014/07/creating-typescript-classes-dynamically/


# Compiling examples #

int a = b + adder.add(c, d);

 - Step 1:
thread.pushCurrentProgram();
  -- macht:
    stackframes.push(stack.size);
    pcStack.push(pc);
    programStack.push(currentProgram);
  --
  stack.push(stack[pos_adder]); 
  stack.push(stack[pos_c]);
  stack.push(stack[pos_d]);
  programstack.push(stack[pos_adder]["add(int, int)"])
  thread.pc = -1;

Step 2: 
  stack[pos_a] = stack[pos_b] + stack[pos_retVal];


String test(int a, double b){
  int c = a + Math.round(b);
  return "Test: " + c + b;
}


