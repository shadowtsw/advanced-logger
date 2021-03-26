# typescript-logger
advanced console.logger with more details, options etc... uses currying

## requirements
- Typescript-Project
- Enviroment "development" (process.env.NODE_ENV = "development")
- compile to at least es6

## prepare
1. <code>npm install caller-path</code>
2. place the console.logger.ts where you want

## import
<code>import logger,{log} from "YOUR PATH TO FILE"</code>

## basic usage
1. <code>logger()("YOUR LOG GOES HERE") // -> equals console.log("YOUR LOG GOES HERE")</code>
2. <code>logger(log)("YOUR LOG GOES HERE") // -> equals console.log("YOUR LOG GOES HERE")</code>

## basic ouput
```
    2021-03-26 | 12:12:39 |
    File: App.ts *- | CallerFunction: ROOT-FILE *- |
    ------------------------
     YOUR LOG GOES HERE
    ++
```
```
    2021-03-26 | 12:12:39 |
    File: anotherFile.ts *- | CallerFunction: testFunction() *- |
    ------------------------
     YOUR LOG GOES HERE
    ++
```




