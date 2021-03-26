# typescript-logger
advanced console.logger with more details, options etc... uses currying

## requirements
- Typescript-Project
- Enviroment "development" (process.env.NODE_ENV = "development")
- at least es6

## prepare
1. <code>npm install caller-path</code>
2. place the console.logger.ts where you want

## import
import logger,{log} from "YOUR PATH TO FILE"

## basic usage
1. <code>logger()("YOUR LOG GOES HERE") // -> equals console.log(YOUR LOG GOES HERE)</code>
2. <code>logger(log)(YOUR LOG GOES HERE) // -> equals console.log(YOUR LOG GOES HERE)</code>



