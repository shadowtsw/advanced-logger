//TO USE JUST IMPORT THIS LINE
//import consoLe, { log, warn, error,consoleSettings } from './utils/console.logger';
//MAKE SURE YOU INSTALL npm install caller-path

//USAGE
// Just like normal console.log() with a slight different syntax.
// Use Uppercase-Letter L and two parentheses ()() --> consoLe(log)(YOUR VARIABEL)
// --> consoLe(log)("YOUR LOG")

//consoLe(LOGTYPE,OPTIONS?,TOPIC?)(TEXT TO LOG)

//LOGTYPE -> log, warn, _error, _err
//OPTIONS -->
// {
//     FileName: true | false | string --> display FileName or display Custom String
//     Path: true | false | string --> same as FileName
//     dateTime: true | false -- > display Date
//     Time: true|false --> display Time

// }

import path from 'path';
import fs from 'fs';
const callerPath = require('caller-path');

interface Options {
  FileName?: string | boolean;
  Path?: string | boolean;
  error?: boolean;
  FunctionName?: string | null;
  Seperator?: string;
  dateTime?: boolean;
  Time?: boolean;
  DevOnly?: boolean;
  CallerFunction?: boolean | string;
}

type AllowedConsoleLogs =
  | typeof console.log
  | typeof console.warn
  | typeof console.error
  | typeof Error
  | 'browser'
  | 'error';

export const log = console.log;
export const warn = console.warn;
export const _err = console.error;
export const _error = 'error';
export const browser = 'browser';

interface ConsoleSettings {
  default: {
    [index: string]: any;
  };
  get: (arg: string) => any;
  set: (arg: string, value: string | boolean | null) => void;
}

export const consoleSettings: ConsoleSettings = {
  default: {
    FileName: true,
    Path: false,
    error: true,
    FunctionName: null,
    Seperator: '*- |',
    dateTime: true,
    Time: true,
    DevOnly: true,
  },
  get: (arg: string) => {
    return consoleSettings.default[arg];
  },
  set: (arg: string, value: any) => {
    consoleSettings.default[arg] = value;
  },
};

const logger = (cb?: AllowedConsoleLogs, options?: Options, topic?: string) => (
  ...text: any
) => {
  const DevOnly =
    options?.DevOnly !== undefined
      ? options.DevOnly
      : consoleSettings.get('DevOnly');

  const getType = (arg: any) => {
    if (arg === null) {
      return false;
    }
    if (typeof arg === 'boolean') {
      return arg;
    }
    return typeof arg;
  };

  if (cb === undefined) {
    cb = console.log;
  }

  if (process.env.NODE_ENV === 'development' && DevOnly && cb !== 'browser') {
    //Check options
    const FileName =
      options?.FileName !== undefined
        ? options.FileName
        : consoleSettings.get('FileName');
    const Path =
      options?.Path !== undefined ? options.Path : consoleSettings.get('Path');
    const error =
      options?.error !== undefined
        ? options.error
        : consoleSettings.get('error');
    const FunctionName = options?.FunctionName || null;
    const Seperator =
      options?.Seperator !== undefined
        ? options.Seperator
        : consoleSettings.get('Seperator');
    const dateTime =
      options?.dateTime !== undefined
        ? options.dateTime
        : consoleSettings.get('dateTime');
    const Time =
      options?.Time !== undefined ? options.Time : consoleSettings.get('Time');
    const CallerFunction =
      options?.CallerFunction !== undefined ? options.CallerFunction : true;

    //Compute values
    let computedFileName;
    let computedPathName;
    let computedDateTime;
    let computedTime;
    let computedCallerName;
    let computedError;

    switch (getType(FileName)) {
      case true:
        const callerPathString = callerPath().split('\\');
        computedFileName = callerPathString[callerPathString.length - 1];
        if (computedFileName.includes('/')) {
          computedFileName = 'Internal process';
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
        const stackTrace = new Error().stack;
        let callerName = stackTrace?.replace(/^Error\s+/, '');
        callerName = callerName?.split('\n')[2]; // 1st item is this, 2nd item is caller
        callerName = callerName?.replace(/^\s+at Object./, '');
        callerName = callerName?.replace(/ \(.+\)$/, '');
        callerName = callerName?.replace(/\@.+/, '');
        callerName = callerName?.replace(/at/g, '');
        callerName = callerName?.trim();
        if (callerName?.includes('anonymous')) {
          computedCallerName = 'ROOT-FILE';
        } else if (callerName?.includes('\\')) {
          let detectFile = callerName.split('\\');
          callerName = detectFile[detectFile.length - 1];
          callerName = `Function not found in ${callerName}`;
          computedCallerName = callerName;
        } else {
          computedCallerName = callerName + '()';
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
        computedError = text;
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

    //prettier-ignore
    const file = `
    ${computedDateTime?`${computedDateTime} | `:``}${computedTime?`${computedTime} | `:``}${`
    ${computedPathName ? `Path: ${computedPathName} ${Seperator} ` : ``}${!computedFileName?``:`File: ${computedFileName} ${Seperator} `}${computedCallerName?`CallerFunction: ${computedCallerName} ${Seperator}`:``}`}
    ------------------------    
    ${topic?`${topic}:`:""} ${text}
    ++`;

    if (error && computedError && cb === 'error') {
      throw new Error(file);
    } else if (typeof cb !== 'string') {
      cb(file);
    }
  } else if (cb === 'browser') {
    const error =
      options?.error !== undefined
        ? options.error
        : consoleSettings.get('error');
    const dateTime =
      options?.dateTime !== undefined
        ? options.dateTime
        : consoleSettings.get('dateTime');
    const Time =
      options?.Time !== undefined ? options.Time : consoleSettings.get('Time');

    //Compute values
    let computedDateTime;
    let computedTime;

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

    //prettier-ignore
    const file = `
    ${computedDateTime?`${computedDateTime} | `:``}${computedTime?`${computedTime} | `:``}
    ------------------------    
    ${topic?`${topic}:`:""} ${text}
    ++`;
    console.log(file);
  } else {
    console.log(text);
  }
};

export default logger;
