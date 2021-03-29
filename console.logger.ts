import path from 'path';
import fs from 'fs';
const callerPath = require('caller-path');

//interface for main logger function
interface Options {
  FileName?: string | boolean;
  Path?: string | boolean;
  error?: boolean;
  FunctionName?: string | boolean;
  Seperator?: string;
  dateTime?: boolean;
  Time?: boolean;
  DevOnly?: boolean;
  CallerFunction?: boolean | string;
}

//allowed log-types
type AllowedConsoleLogs =
  | typeof console.log
  | typeof console.warn
  | typeof console.error
  | typeof console.table
  | typeof Error
  | 'browser'
  | 'error'
  | 'iterate';

export const log = console.log;
export const warn = console.warn;
export const _err = console.error;
export const _error = 'error';
export const browser = 'browser';
export const iterate = 'iterate';

//global Settings
export class ConsoleSettings {
  protected constructor() {}

  static FileName: string | boolean = true;
  static Path: string | boolean = false;
  static Error: boolean = true;
  static FunctionName: string | boolean = true;
  static Seperator: string = '*- |';
  static DateTime: boolean = true;
  static Time: boolean = true;
  static DevOnly: boolean = true;
  static CallerFunction: boolean | string = true;
}

//document all loggers
export class MasterLog {
  static LoggerList: Array<any> = [];

  static addThisLogger(type: any, inFile: any, inFunction: any) {
    this.LoggerList.push({ type: type, inFile: inFile, inFunction });
  }

  static getLoggers() {
    return this.LoggerList;
  }

  static getStatus(): string {
    return 'Under Development';
  }
}

//testing purpose for addLogger
MasterLog.addThisLogger('log', 'App.st', 'Play aroung');

interface ComputedValues {
  computedFileName: string | boolean | null;
  computedPathName: string | boolean | null;
  computedDateTime: string | null | boolean;
  computedTime: string | null;
  computedCallerName: string | null | boolean;
  computedError: string | null;
}

//log-template
const fileTemplateTopic = (
  textObject: any,
  text?: Array<any>,
  topic?: string
): string => {
  const {
    computedDateTime,
    computedTime,
    computedPathName,
    Seperator,
    computedFileName,
    computedCallerName,
  } = textObject;
  //prettier-ignore
  const header = `
  -->
    ${computedDateTime ? `${computedDateTime} | ` : ``}${computedTime ? `${computedTime} | ` : ``}${`
    ${computedPathName ? `Path: ${computedPathName} ${Seperator} ` : ``}${!computedFileName ? `` : `File: ${computedFileName} ${Seperator} `}${computedCallerName ? `CallerFunction: ${computedCallerName} ${Seperator}` : ``}`}
    ------------------------`

  if (!topic && text?.length === 0) {
    return header;
  } else {
    //prettier-ignore
    return (
      header + `
${topic ? `${topic}:` : ''} ${text && text.length > 0 ? text : ''}`
    );
  }
};

//displays content in console
const display = (
  callback: Function,
  textObject: any,
  fileTemplate: any,
  text: Array<any>,
  topic?: string
) => {
  callback(fileTemplate(textObject));

  for (let [index, entry] of text.entries()) {
    if (typeof entry !== 'object') {
      callback(`${topic ? `${topic}[${index}]:` : ''} ${entry}`);
    } else {
      callback(topic ? topic + '[' + index + ']' + ':' : '', entry);
    }
  }
  callback(`<--
  `);
};

//check for types in input array, set primitives true|false
const checkArray = (textObject: Array<any>): boolean => {
  let checkForPrimitives = true;

  for (let object of textObject) {
    if (typeof object === 'object') {
      checkForPrimitives = false;
    }
  }
  return checkForPrimitives;
};

//get types for switch cases/computing steps
const getType = (arg: any) => {
  if (arg === null) {
    return false;
  }
  if (typeof arg === 'boolean') {
    return arg;
  }
  if (Array.isArray(arg)) {
    return 'Array';
  }
  return typeof arg;
};

//generate file name
const generateFileName = (callerName: string | undefined) => {
  if (callerName) {
    let _FILE_ROW = callerName.split('\n')[2];
    let _FILE_NAME = _FILE_ROW.split('\\');
    const index = _FILE_NAME.length - 1;
    let DESTINATION = _FILE_NAME[index].replace(/\)/g, '');
    DESTINATION = DESTINATION.replace(/:/, ' at ');
    DESTINATION = DESTINATION.trim();
    return DESTINATION;
  }
  return 'Error in generating FileName, please check !';
};

//generate function name
const generateFunctionName = (callerName: string | undefined) => {
  let _FUNCTION_NAME = callerName?.split('\n')[2];
  _FUNCTION_NAME = _FUNCTION_NAME?.replace(/^\s+at Object./, '');
  _FUNCTION_NAME = _FUNCTION_NAME?.replace(/ \(.+\)$/, '');
  _FUNCTION_NAME = _FUNCTION_NAME?.replace(/\@.+/, '');
  _FUNCTION_NAME = _FUNCTION_NAME?.replace(/at/g, '');
  return _FUNCTION_NAME?.trim();
};

type MultiType = string | boolean | null;
type TimeObject = Date | boolean | null;
type TimeString = string | boolean | null;
type StringValidator = string | boolean;

// compute logger file-,path-,function-name properties
const computingSteps = (
  FileName: StringValidator,
  callerName: string | undefined,
  computedFileName: MultiType,
  Path: StringValidator,
  computedPathName: MultiType,
  dateTime: TimeObject,
  computedDateTime: TimeString,
  Time: TimeObject,
  computedTime: TimeString,
  CallerFunction: MultiType,
  computedCallerName: MultiType,
  error: boolean | null,
  computedError: MultiType,
  text: Array<any>
) => {
  switch (getType(FileName)) {
    case true:
      if (callerName) {
        computedFileName = generateFileName(callerName);
      }
      if (
        typeof computedFileName === 'string' &&
        computedFileName?.includes('/')
      ) {
        computedFileName = 'Internal process';
        break;
      }
      break;
    case false:
      computedFileName = null;
      break;
    case 'string':
      computedFileName = FileName;
      break;
    default:
      break;
  }

  switch (getType(Path)) {
    case true:
      const callerPathString = callerPath().split('\\');
      computedPathName = callerPathString
        .slice(0, callerPathString.length - 1)
        .toString()
        .replace(/,/g, '\\');
      break;
    case false:
      computedPathName = null;
      break;
    case 'string':
      computedPathName = FileName;
      break;
    default:
      break;
  }

  switch (getType(dateTime)) {
    case true:
      const date = new Date().toISOString().split('T')[0];
      computedDateTime = date;
      break;
    case false:
      computedDateTime = null;
      break;
    default:
      break;
  }

  switch (getType(Time)) {
    case true:
      const time = new Date().toISOString().split('T')[1].split('.')[0];
      computedTime = time;
      break;
    case false:
      computedTime = null;
      break;
    default:
      break;
  }

  switch (getType(CallerFunction)) {
    case 'string':
      computedCallerName = CallerFunction;
      break;
    case true:
      let _FUNCTION_NAME = generateFunctionName(callerName);
      if (_FUNCTION_NAME?.includes('anonymous')) {
        computedCallerName = 'ROOT-FILE';
      } else if (_FUNCTION_NAME?.includes('\\')) {
        let detectFile = _FUNCTION_NAME.split('\\');
        _FUNCTION_NAME = detectFile[detectFile.length - 1];
        _FUNCTION_NAME = `Function not found in ${_FUNCTION_NAME}`;
        computedCallerName = _FUNCTION_NAME;
      } else {
        computedCallerName = _FUNCTION_NAME + '()';
      }
      break;
    case undefined:
    case null:
    case false:
      computedCallerName = null;
      break;
    default:
      break;
  }

  switch (getType(error)) {
    case true:
      console.log('getType(error) fires');
      computedError = text.toString();
      console.log('Error text', computedError);
      break;
    case false:
    case null:
      computedError = null;
      break;
    case 'string':
      break;
    default:
      break;
  }

  const Seperator = '*+-';

  return {
    computedFileName,
    computedPathName,
    computedDateTime,
    computedTime,
    computedCallerName,
    computedError,
    Seperator,
  };
};

const logger = (cb?: AllowedConsoleLogs, options?: Options, topic?: string) => (
  ...text: any
) => {
  //check for dev mode
  const DevOnly =
    options?.DevOnly !== undefined ? options.DevOnly : ConsoleSettings.DevOnly;

  //Check options
  const FileName =
    options?.FileName !== undefined
      ? options.FileName
      : ConsoleSettings.FileName;
  const Path =
    options?.Path !== undefined ? options.Path : ConsoleSettings.Path;
  const error =
    options?.error !== undefined ? options.error : ConsoleSettings.Error;
  const FunctionName = options?.FunctionName || null;
  const Seperator =
    options?.Seperator !== undefined
      ? options.Seperator
      : ConsoleSettings.Seperator;
  const dateTime =
    options?.dateTime !== undefined
      ? options.dateTime
      : ConsoleSettings.DateTime;
  const Time =
    options?.Time !== undefined ? options.Time : ConsoleSettings.Time;
  const CallerFunction =
    options?.CallerFunction !== undefined
      ? options.CallerFunction
      : ConsoleSettings.CallerFunction;

  //identify logger-type for registering
  const logType = (cb: AllowedConsoleLogs | undefined) => {
    switch (cb) {
      case console.log:
        return 'log';
      case console.warn:
        return 'warn';
      case console.error:
        return 'error';
      case Error:
        return 'Error Object';
      case 'browser':
        return 'browser';
      case 'error':
        return 'error';
      case 'iterate':
        return 'iterate';
      default:
        return 'Type not found, please check !';
    }
  };

  //Compute values
  const computedObject: ComputedValues = {
    computedFileName: '',
    computedPathName: '',
    computedDateTime: '',
    computedTime: '',
    computedCallerName: '',
    computedError: '',
  };

  //DETECT PATH
  const stackTrace = new Error().stack;
  let callerName = stackTrace?.replace(/^Error\s+/, '');

  //Fallback
  if (cb === undefined) {
    cb = console.log;
  }

  //start generating Log´s
  if (process.env.NODE_ENV === 'development' && DevOnly) {
    if (cb !== 'browser' && cb !== 'iterate') {
      const computed = computingSteps(
        FileName,
        callerName,
        computedObject.computedFileName,
        Path,
        computedObject.computedPathName,
        dateTime,
        computedObject.computedDateTime,
        Time,
        computedObject.computedTime,
        CallerFunction,
        computedObject.computedCallerName,
        error,
        computedObject.computedError,
        text
      );

      const result = { ...computedObject, ...computed };

      let onlyPrimitives = checkArray(text);

      MasterLog.addThisLogger(
        logType(cb),
        generateFileName(callerName),
        generateFunctionName(callerName)
      );

      if (error && result.computedError && cb === 'error') {
        throw new Error(fileTemplateTopic(result, text, topic));
      } else if (typeof cb !== 'string') {
        if (onlyPrimitives) {
          cb(fileTemplateTopic(result, text, topic));
          cb('<--');
        } else {
          display(cb, result, fileTemplateTopic, text, topic);
        }
      }
    } else if (cb === 'browser') {
      const computed = computingSteps(
        FileName,
        callerName,
        computedObject.computedFileName,
        Path,
        computedObject.computedPathName,
        dateTime,
        computedObject.computedDateTime,
        Time,
        computedObject.computedTime,
        CallerFunction,
        computedObject.computedCallerName,
        error,
        computedObject.computedError,
        text
      );

      const result = { ...computedObject, ...computed };

      MasterLog.addThisLogger(
        logType(cb),
        generateFileName(callerName),
        generateFunctionName(callerName)
      );

      //prettier-ignore
      const file = `
        ${result.computedDateTime ? `${result.computedDateTime} | ` : ``}${result.computedTime ? `${result.computedTime} | ` : ``}
        ------------------------    
        ${topic ? `${topic}:` : ""} ${text}
        ++`;
      console.log(file);
    } else if (cb === 'iterate') {
      const computed = computingSteps(
        FileName,
        callerName,
        computedObject.computedFileName,
        Path,
        computedObject.computedPathName,
        dateTime,
        computedObject.computedDateTime,
        Time,
        computedObject.computedTime,
        CallerFunction,
        computedObject.computedCallerName,
        error,
        computedObject.computedError,
        text
      );

      const result = { ...computedObject, ...computed };

      MasterLog.addThisLogger(
        logType(cb),
        generateFileName(callerName),
        generateFunctionName(callerName)
      );

      //prettier-ignore
      console.log(fileTemplateTopic(
          result, [""], topic
        ));
      text.forEach((object: any) => {
        console.table(object);
      });
      console.log('');
      console.log(`
    <--`);
    } else {
      console.log(text);
    }
  } else {
    //Fires if production mode || DevOnly is false

    MasterLog.addThisLogger(
      logType(cb),
      generateFileName(callerName),
      generateFunctionName(callerName)
    );
  }
};

export default logger;
