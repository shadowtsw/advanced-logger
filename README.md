# advanced Javascript|Typescript-logger
advanced console.logger with more details, options etc... uses currying

## requirements Typescript
- Typescript-Project
- Enviroment "development" (process.env.NODE_ENV = "development")
- compile to at least es6
- "strict mode" for correct path-detection
- Types for node (npm install @types/node)

## prepare
1. <code>npm install caller-path</code>
2. place the console.logger.ts/js where you want

## import TS
```
import logger,{log} from "YOUR PATH TO FILE"
```

## import JS
```
const Logger = require('./console.logger');
const { logger, log } = Logger;
```

## basic usage
1. <code>logger()("YOUR LOG GOES HERE")     // -> equals console.log("YOUR LOG GOES HERE")</code>
2. <code>logger(log)("YOUR LOG GOES HERE")  // -> equals console.log("YOUR LOG GOES HERE")</code>

## basic ouput
```
    -->
    2021-03-26 | 12:12:39 |
    File: App.ts at 35:9 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
     YOUR LOG GOES HERE
<--
```
```
    -->
    2021-03-26 | 12:12:39 |
    File: anotherFile.ts at 7:18 *- | CallerFunction: testFunction() *- |
    ------------------------
     YOUR LOG GOES HERE
<--
```

## topic
<code>logger(log,{},"MYTOPIC")("LOG MESSAGE")</code>
```
    -->
    2021-03-26 | 12:12:39 |
    File: anotherFile.ts at 7:18 *- | CallerFunction: testFunction() *- |
    ------------------------
     MYTOPIC: LOG MESSAGE
<--
```

## console parameters
Due to this function is based on console.log, per default all logs happen within this enviroment.
But there are some modifications, which can be used:
```
import logger,{log,warn,_err,_error,browser} from "YOUR PATH TO FILE"
```
```
log     //as default, this can also be omitted -> uses console.log
warn    // uses console.warn
iterate // displays primitives line by line, objects and arrays as table
_err    // uses console.error
_error  // when settings.error is true, this will throw an error
browser // can be used to display logs within browser
```
### example usage
```
logger(log)("YOUR LOG GOES HERE") // -> equals console.log("YOUR LOG GOES HERE")
logger(warn)("YOUR LOG GOES HERE") // -> equals console.warn("YOUR LOG GOES HERE")
```
## structure of logger
<code>customName(consoleParameter,{options},topic)(thingsToLog)</code>

## options
There are two types of options:
1. Global options, which affects all logs
2. Inline options, which overrides the global settings for a specific log

### Available options incl. default value
```
{
    FileName: true,     // displays filename
    Path: false,        // displays path to file
    error: true,        // when true, allows to throw errors
    FunctionName: null, // not available yet
    Seperator: '*- |',  // string to seperate log info´s
    dateTime: true,     // displays date
    Time: true,         // displays time
    DevOnly: true,      // when true, all logs are only appear in development-mode
}
```

## use of global and inline options
```
import logger,{log, ConsoleSettings} from "YOUR PATH TO FILE"

//get global settings
ConsoleSettings.<"PROPERTYNAME">;

//set global settings
ConsoleSettings.<"PROPERTYNAME"> = value;

//use inline settings -> keep in mind that this will override global settings for this specific logger
logger(log,{Path:true})("YOUR LOG GOES HERE")

```
## use of currying and curried options
Since its a curried function, you can also do the following examples for easier handling:
```
import logger,{log,_error,iterate} from "YOUR PATH TO FILE"

const thrError = logger(_error,{Path:true},"MyError-Topic");

function errorTest(arg){
    if(arg){
        thrError("No valid Input !")
    } else {
        logger()("Do nothing")
    }
}

errorTest(true)

//OUTPUT
Error: -->
    2021-03-27 | 19:53:37 |
    Path: I:\Javascript\6-GIT-Projekte\creditor *- | File: App.ts at 40:5 *- | CallerFunction: errorTest() *- |
    ------------------------
    MyError-Topic: No valid Input !
    
    at I:\Javascript\6-GIT-Projekte\creditor\utils\console.logger.ts:276:13
    at errorTest (I:\Javascript\6-GIT-Projekte\creditor\App.ts:40:5)
    at Object.<anonymous> (I:\Javascript\6-GIT-Projekte\creditor\App.ts:45:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Module.m._compile (I:\Javascript\6-GIT-Projekte\creditor\node_modules\ts-node\src\index.ts:1056:23)
    at Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Object.require.extensions.<computed> [as .ts] (I:\Javascript\6-GIT-Projekte\creditor\node_modules\ts-node\src\index.ts:1059:12)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
<--

```

```
import logger,{log,_error,iterate} from "YOUR PATH TO FILE"

const logArray = logger(iterate,{},"Array-Table");

const arrayToLog = ["Peter","Michael","John"];

logArray(arrayToLog);

//OUTPUT
-->
    2021-03-27 | 19:55:46 |
    File: App.ts at 40:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
    Array-Table:
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │  'Peter'  │
│    1    │ 'Michael' │
│    2    │  'John'   │
└─────────┴───────────┘

<--

```
### output depends on types for normal logs
```
import logger, { log,iterate } from './utils/console.logger';

const iterLogger = logger(iterate, {}, 'Iterate log');
const usualLogger = logger(log, {}, 'Misc types log');
const primitiveLogger = logger(log, {}, 'Primitives only');

const object = { key: 'value', anotherKey: 'anotherValue' };
const string = 'John Doe';
const numOne = 1;
const numTwo = 2;

usualLogger(object, numTwo, string, numOne);
iterLogger(object, numTwo, string, numOne);
primitiveLogger('test', 'another test', 'last test');

//OUTPUT
-->
    2021-03-27 | 20:21:32 |
    File: App.ts at 45:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
Misc types log[0]: { key: 'value', anotherKey: 'anotherValue' }
Misc types log[1]: 2
Misc types log[2]: John Doe
Misc types log[3]: 1
<--
-->
    2021-03-27 | 20:21:32 |
    File: App.ts at 46:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
    Iterate log:
┌────────────┬────────────────┐
│  (index)   │     Values     │
├────────────┼────────────────┤
│    key     │    'value'     │
│ anotherKey │ 'anotherValue' │
└────────────┴────────────────┘
2
John Doe
1

<--
-->
    2021-03-27 | 20:21:32 |
    File: App.ts at 47:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
    Primitives only: test,another test,last test

<--

```
### output without topic
```
const iterLogger = logger(iterate, {});
const usualLogger = logger(log, {});
const primitiveLogger = logger(log, {});

//OUTPUT WITHOUT SPECIFIED TOPIC
-->
    2021-03-27 | 20:24:47 |
    File: App.ts at 45:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
 { key: 'value', anotherKey: 'anotherValue' }
 2
 John Doe
 1
<--
-->
    2021-03-27 | 20:24:47 |
    File: App.ts at 46:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------

┌────────────┬────────────────┐
│  (index)   │     Values     │
├────────────┼────────────────┤
│    key     │    'value'     │
│ anotherKey │ 'anotherValue' │
└────────────┴────────────────┘
2
John Doe
1

<--
-->
    2021-03-27 | 20:24:47 |
    File: App.ts at 47:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
     test,another test,last test

<--

```




