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
import logger,{log, consoleSettings} from "YOUR PATH TO FILE"

//get global settings
consoleSettings.get("PROPERTYNAME");

//set global settings
consoleSettings.set("PROPERTYNAME",value)

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

```
import logger, { log,iterate } from './utils/console.logger';

const iterLogger = logger(iterate, {}, 'Iterate log');
const usualLogger = logger(log, {}, 'Usual log');

const object = { key: 'value', anotherKey: 'anotherValue' };
const string = 'John Doe';
const numOne = 1;
const numTwo = 2;

usualLogger(object, numTwo, string, numOne);
iterLogger(object, numTwo, string, numOne);

//OUTPUT
-->
    2021-03-27 | 20:07:32 |
    File: App.ts at 44:1 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
Usual log: { key: 'value', anotherKey: 'anotherValue' }
Usual log: 2
Usual log: John Doe
Usual log: 1
<--
-->
    2021-03-27 | 20:07:32 |
    File: App.ts at 45:1 *- | CallerFunction: ROOT-FILE *- |
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

```




