import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor() { }

  sortArrayOfObjects(arrayToSort, key, type, datatype = null) {
    function compareObjects(a, b) {
      if (datatype === 'date') {
     //   debugger;
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        if (type === 'asc') {
          return dateA > dateB ? 1 : -1;
        }
        if (type === 'desc') {
          return dateA > dateB ? -1 : 1;
        }
      }
      if (datatype === 'string') {
        const firstElemnet = (a[key] ? a[key].toLowerCase() : a[key]);
        const secondElement = (b[key] ? b[key].toLowerCase() : b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'currency') {
        const regExpr = /[^a-zA-Z0-9-. ]/g;
        const firstElemnet = Number(a[key].replace(regExpr, ''));
        const secondElement = Number(b[key].replace(regExpr, ''));
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'percentage') {
        const firstElemnet = (a[key] ? Number(a[key].replace('%', '')) : a[key]);
        const secondElement = (b[key] ? Number(b[key].replace('%', '')) : b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'number') {
        const firstElemnet = Number(a[key]);
        const secondElement = Number(b[key]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
      if (datatype === 'distinct') {
        let firstElemnet = a[key];
        firstElemnet = firstElemnet.split('/');
        firstElemnet = Number(firstElemnet[0]);
        let secondElement = b[key];
        secondElement = secondElement.split('/');
        secondElement = Number(secondElement[0]);
        if (type === 'asc') {
          return firstElemnet > secondElement ? 1 : -1;
        }
        if (type === 'desc') {
          return firstElemnet > secondElement ? -1 : 1;
        }
      }
    }
    return arrayToSort.sort(compareObjects);
  }



  setDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()
        + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()) || '');
    }
  }
}
