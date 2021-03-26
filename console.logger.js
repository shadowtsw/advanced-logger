const callerPath = require('caller-path');

const log = console.log;
const warn = console.warn;
const _err = console.error;
const _error = 'error';
const browser = 'browser';

const consoleSettings = {
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
  get: (arg) => {
    return consoleSettings.default[arg];
  },
  set: (arg, value) => {
    consoleSettings.default[arg] = value;
  },
};

// const logger = (cb, options, topic) => (...text) => {
//   const DevOnly =
//     options?.DevOnly !== undefined
//       ? options.DevOnly
//       : consoleSettings.get('DevOnly');

//   const getType = (arg) => {
//     if (arg === null) {
//       return false;
//     }
//     if (typeof arg === 'boolean') {
//       return arg;
//     }
//     return typeof arg;
//   };

//   if (cb === undefined) {
//     cb = console.log;
//   }

//   if (process.env.NODE_ENV === 'development' && DevOnly && cb !== 'browser') {
//     //Check options
//     const FileName =
//       options?.FileName !== undefined
//         ? options.FileName
//         : consoleSettings.get('FileName');
//     const Path =
//       options?.Path !== undefined ? options.Path : consoleSettings.get('Path');
//     const error =
//       options?.error !== undefined
//         ? options.error
//         : consoleSettings.get('error');
//     const FunctionName = options?.FunctionName || null;
//     const Seperator =
//       options?.Seperator !== undefined
//         ? options.Seperator
//         : consoleSettings.get('Seperator');
//     const dateTime =
//       options?.dateTime !== undefined
//         ? options.dateTime
//         : consoleSettings.get('dateTime');
//     const Time =
//       options?.Time !== undefined ? options.Time : consoleSettings.get('Time');
//     const CallerFunction =
//       options?.CallerFunction !== undefined ? options.CallerFunction : true;

//     //Compute values
//     let computedFileName;
//     let computedPathName;
//     let computedDateTime;
//     let computedTime;
//     let computedCallerName;
//     let computedError;

//     switch (getType(FileName)) {
//       case true:
//         const callerPathString = callerPath().split('\\');
//         computedFileName = callerPathString[callerPathString.length - 1];
//         if (computedFileName.includes('/')) {
//           computedFileName = 'Internal process';
//         }
//         break;
//       case false:
//         computedFileName = null;
//         break;
//       case 'string':
//         computedFileName = FileName;
//         break;
//       default:
//         break;
//     }

//     switch (getType(Path)) {
//       case true:
//         const callerPathString = callerPath().split('\\');
//         computedPathName = callerPathString
//           .slice(0, callerPathString.length - 1)
//           .toString()
//           .replace(/,/g, '\\');
//         break;
//       case false:
//         computedPathName = null;
//         break;
//       case 'string':
//         computedPathName = FileName;
//         break;
//       default:
//         break;
//     }

//     switch (getType(dateTime)) {
//       case true:
//         const date = new Date().toISOString().split('T')[0];
//         computedDateTime = date;
//         break;
//       case false:
//         computedDateTime = null;
//         break;
//       default:
//         break;
//     }

//     switch (getType(Time)) {
//       case true:
//         const time = new Date().toISOString().split('T')[1].split('.')[0];
//         computedTime = time;
//         break;
//       case false:
//         computedTime = null;
//         break;
//       default:
//         break;
//     }

//     switch (getType(CallerFunction)) {
//       case 'string':
//         computedCallerName = CallerFunction;
//         break;
//       case true:
//         const stackTrace = new Error().stack;
//         let callerName = stackTrace?.replace(/^Error\s+/, '');
//         callerName = callerName?.split('\n')[2]; // 1st item is this, 2nd item is caller
//         callerName = callerName?.replace(/^\s+at Object./, '');
//         callerName = callerName?.replace(/ \(.+\)$/, '');
//         callerName = callerName?.replace(/\@.+/, '');
//         callerName = callerName?.replace(/at/g, '');
//         callerName = callerName?.trim();
//         if (callerName?.includes('anonymous')) {
//           computedCallerName = 'ROOT-FILE';
//         } else if (callerName?.includes('\\')) {
//           let detectFile = callerName.split('\\');
//           callerName = detectFile[detectFile.length - 1];
//           callerName = `Function not found in ${callerName}`;
//           computedCallerName = callerName;
//         } else {
//           computedCallerName = callerName + '()';
//         }
//         break;
//       case undefined:
//       case null:
//       case false:
//         computedCallerName = null;
//         break;
//       default:
//         break;
//     }

//     switch (getType(error)) {
//       case true:
//         computedError = text;
//         break;
//       case false:
//       case null:
//         computedError = null;
//         break;
//       case 'string':
//         break;
//       default:
//         break;
//     }

//     //prettier-ignore
//     const file = `
//     ${computedDateTime?`${computedDateTime} | `:``}${computedTime?`${computedTime} | `:``}${`
//     ${computedPathName ? `Path: ${computedPathName} ${Seperator} ` : ``}${!computedFileName?``:`File: ${computedFileName} ${Seperator} `}${computedCallerName?`CallerFunction: ${computedCallerName} ${Seperator}`:``}`}
//     ------------------------
//     ${topic?`${topic}:`:""} ${text}
//     ++`;

//     if (error && computedError && cb === 'error') {
//       throw new Error(file);
//     } else if (typeof cb !== 'string') {
//       cb(file);
//     }
//   } else if (cb === 'browser') {
//     const error =
//       options?.error !== undefined
//         ? options.error
//         : consoleSettings.get('error');
//     const dateTime =
//       options?.dateTime !== undefined
//         ? options.dateTime
//         : consoleSettings.get('dateTime');
//     const Time =
//       options?.Time !== undefined ? options.Time : consoleSettings.get('Time');

//     //Compute values
//     let computedDateTime;
//     let computedTime;

//     switch (getType(dateTime)) {
//       case true:
//         const date = new Date().toISOString().split('T')[0];
//         computedDateTime = date;
//         break;
//       case false:
//         computedDateTime = null;
//         break;
//       default:
//         break;
//     }

//     switch (getType(Time)) {
//       case true:
//         const time = new Date().toISOString().split('T')[1].split('.')[0];
//         computedTime = time;
//         break;
//       case false:
//         computedTime = null;
//         break;
//       default:
//         break;
//     }

//     //prettier-ignore
//     const file = `
//     ${computedDateTime?`${computedDateTime} | `:``}${computedTime?`${computedTime} | `:``}
//     ------------------------
//     ${topic?`${topic}:`:""} ${text}
//     ++`;
//     console.log(file);
//   } else {
//     console.log(text);
//   }
// };

function rawLogger(cb, options, topic, ...text) {
  const DevOnly =
    options?.DevOnly !== undefined
      ? options.DevOnly
      : consoleSettings.get('DevOnly');

  const getType = (arg) => {
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

    //DETECT PATH
    const stackTrace = new Error().stack;
    let callerName = stackTrace?.replace(/^Error\s+/, '');

    //Compute values
    let computedFileName;
    let computedPathName;
    let computedDateTime;
    let computedTime;
    let computedCallerName;
    let computedError;

    switch (getType(FileName)) {
      case true:
        let _FILE_NAME = callerName.split('\n')[2];
        _FILE_NAME = _FILE_NAME.split('\\');
        _FILE_NAME = _FILE_NAME[_FILE_NAME.length - 1].replace(/\)/g, '');
        _FILE_NAME = _FILE_NAME.replace(/:/, ' at ');
        _FILE_NAME = _FILE_NAME.trim();
        computedFileName = _FILE_NAME;
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
        let _FUNCTION_NAME = callerName.split('\n')[2]; // 1st item is this, 2nd item is caller
        _FUNCTION_NAME = _FUNCTION_NAME.replace(/^\s+at Object./, '');
        _FUNCTION_NAME = _FUNCTION_NAME.replace(/ \(.+\)$/, '');
        _FUNCTION_NAME = _FUNCTION_NAME.replace(/\@.+/, '');
        _FUNCTION_NAME = _FUNCTION_NAME.replace(/at/g, '');
        _FUNCTION_NAME = _FUNCTION_NAME.trim();
        if (_FUNCTION_NAME.includes('anonymous')) {
          computedCallerName = 'ROOT-FILE';
        } else if (_FUNCTION_NAME.includes('\\')) {
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
}

function curry(func) {
  return function (cb, options, topic) {
    return function (...text) {
      return func(cb, options, topic, ...text);
    };
  };
}

let logger = curry(rawLogger);

module.exports = { logger, log, warn, _err, _error, consoleSettings };
