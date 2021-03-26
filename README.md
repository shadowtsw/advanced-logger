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
1. <code>logger()("YOUR LOG GOES HERE") // -> equals console.log("YOUR LOG GOES HERE")</code>
2. <code>logger(log)("YOUR LOG GOES HERE") // -> equals console.log("YOUR LOG GOES HERE")</code>

## basic ouput
```
    2021-03-26 | 12:12:39 |
    File: App.ts at 35:9 *- | CallerFunction: ROOT-FILE *- |
    ------------------------
     YOUR LOG GOES HERE
    ++
```
```
    2021-03-26 | 12:12:39 |
    File: anotherFile.ts at 7:18 *- | CallerFunction: testFunction() *- |
    ------------------------
     YOUR LOG GOES HERE
    ++
```

## topic
<code>logger(log,{},"MYTOPIC")("LOG MESSAGE")</code>
```
    2021-03-26 | 12:12:39 |
    File: anotherFile.ts at 7:18 *- | CallerFunction: testFunction() *- |
    ------------------------
     MYTOPIC: LOG MESSAGE
    ++
```

## console parameters
Due to this function is based on console.log, per default all logs happen within this enviroment.
But there are some modifications, which can be used:
```
import logger,{log,warn,_err,_error,browser} from "YOUR PATH TO FILE"
```
```
log //as default, this can also be omitted -> uses console.log
warn // uses console.warn
_err // uses console.error
_error // when settings.error is true, this will throw an error
browser // can be used to display logs within browser
```
<h3>example usage</h3>
<code>logger(log)("YOUR LOG GOES HERE") // -> equals console.log("YOUR LOG GOES HERE")</code>
<code>logger(warn)("YOUR LOG GOES HERE") // -> equals console.warn("YOUR LOG GOES HERE")</code>

## options
There are two types of options:
1. Global options, which affects all logs
2. Inline options, which overrides the global settings for a specific log

<h2>Available options incl. default value</h2>
```
{
    FileName: true, // displays filename
    Path: false, // displays path to file
    error: true, // when true, allows to throw errors
    FunctionName: null, // not available yet
    Seperator: '*- |', // string to seperate log info´s
    dateTime: true, // displays date
    Time: true, // displays time
    DevOnly: true, // when true, all logs are only appear in development-mode
}
```



