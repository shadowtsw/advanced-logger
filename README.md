# typescript-logger
advanced console.logger with more details, options etc... uses currying

## requirements
- Typescript-Project
- Enviroment "development" (process.env.NODE_ENV = "development")
- at least es6

## prepare
1. npm install caller-path
2. place the console.logger.ts where you want

## import
import logger,{log} from "YOUR PATH TO FILE"

## basic usage
1. logger()(YOUR LOG GOES HERE) -> equals console.log(YOUR LOG GOES HERE)
2. logger(log)(YOUR LOG GOES HERE) -> equals console.log(YOUR LOG GOES HERE)

