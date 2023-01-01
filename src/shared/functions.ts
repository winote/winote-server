import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import moment, { Moment } from 'moment';

export const NULL = 'null';
export const UNDEFINED = 'undefined';

export function pad(text: string, width: number, caractere?: string) {
  caractere = caractere || '0';
  text = text + '';
  return text.length >= width
    ? text
    : new Array(width - text.length + 1).join(caractere) + text;
}

export function setValueByPath(
  obj: any,
  path: string,
  value: any,
  separator: string,
) {
  let ref = obj;
  path.split(separator).forEach(function (key, index, arr) {
    ref = ref[key] = index === arr.length - 1 ? value : {};
  });
  return obj;
}

export function getValueByPath(obj: any, path: string, separator: string) {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export function deleteFolder(path: string, keepFolder: boolean = false) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    if (!keepFolder) {
      fs.rmdirSync(path);
    }
  }
}

export function addIfAbsent(array: any[], ...valueToAdd: any) {
  if (!Array.isArray(array)) {
    array = [];
  }
  if (Array.isArray(valueToAdd)) {
    valueToAdd.forEach((value) => {
      if (!array.includes(value)) {
        array.push(value);
      }
    });
  }
  return array;
}

export function chunkArray(array: any[], size: number) {
  let index = 0;
  const arrayLength = array.length;
  const result = [];

  for (index = 0; index < arrayLength; index += size) {
    let chunkArray = array.slice(index, index + size);
    result.push(chunkArray);
  }
  return result;
}

export function subArray(
  input: number[],
  start: number,
  size: number,
): number[] {
  let result: number[] = [];
  for (let i = 0; i < size; i++) {
    result.push(input[start + i]);
  }
  return result;
}

export function utc(date: Date): number {
  let utc = moment.utc(date).valueOf();
  return (utc / 1000) | 0;
}

export function ValidationArrayNotEmptyException(
  field: string,
): BadRequestException {
  let message = {};
  message[`${field}.arrayNotEmpty`] = `${field} should not be empty`;
  return new BadRequestException([message], 'Validation failed');
}

export function getUniqueObjectsArray(arrayValues: any, attribute: string) {
  return Array.isArray(arrayValues)
    ? arrayValues.reduce(
        (acc, cur) => [
          ...acc.filter((obj) => obj[attribute] !== cur[attribute]),
          cur,
        ],
        [],
      )
    : arrayValues;
}

export function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function subtractSecond(date: Date, seconds: number): Moment {
  return moment(date).subtract(seconds, 'seconds');
}

export function subtractDay(date: Date, days: number): Moment {
  return moment(date).subtract(days, 'day');
}

export function cloneColletion(colletion: any[]): any[] {
  if (Array.isArray(colletion)) {
    return colletion.map((column) => ({ ...column }));
  }
  return colletion;
}

export function getNumbersOnly(text: string) {
  return text.replace(/[^0-9]/g, '');
}

export function convertInt(str: string, def?: number): number {
  if (str) {
    try {
      return parseInt(getNumbersOnly(str), 10);
    } catch (e) {
      console.error(e);
    }
  }
  return def;
}

export function convertNumber(str: string, def?: number): number {
  if (str) {
    try {
      return parseFloat(str);
    } catch (e) {
      console.error(e);
    }
  }
  return def;
}

export function safeDeserialize(str: string, def?: any): any {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error(e);
    }
  }
  return def;
}

export function getEnumKeys(enum_: any): string[] {
  return Object.keys(enum_).filter((value) => typeof enum_[value] === 'number');
}
