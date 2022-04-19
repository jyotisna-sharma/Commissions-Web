import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CalenderDataService {
  monthsList = [];
  yearList = [];
  date: any = new Date();

  constructor(


  ) { }
  GetLast5YearList(refYear) {
    this.yearList = [];
    let keyValue = 3; // As 4 values are already added to the list
    let year = refYear; //this.date.getFullYear();
    let currentYear = refYear; //this.date.getFullYear();
    for (year; year < currentYear + 1; year--) {
      keyValue++;
      const data = {
        'key': keyValue,
        'value': year
      }
      if (year === 2014) {
        break;
      }
      this.yearList.push(data);
    };
    return this.yearList;
  }
  GetMonthList() {
    this.monthsList = [];
    this.monthsList.push({ key: 1, value: 'Jan' });
    this.monthsList.push({ key: 2, value: 'Feb' });
    this.monthsList.push({ key: 3, value: 'Mar' });
    this.monthsList.push({ key: 4, value: 'Apr' });
    this.monthsList.push({ key: 5, value: 'May' });
    this.monthsList.push({ key: 6, value: 'Jun' });
    this.monthsList.push({ key: 7, value: 'Jul' });
    this.monthsList.push({ key: 8, value: 'Aug' });
    this.monthsList.push({ key: 9, value: 'Sept' });
    this.monthsList.push({ key: 10, value: 'Oct' });
    this.monthsList.push({ key: 11, value: 'Nov' });
    this.monthsList.push({ key: 12, value: 'Dec' });
    return this.monthsList;
  }

  GetFirstDateOfYear(currentyear) {
    // const currentyear = this.date.getFullYear();
    let newDate
    newDate = '01-01' + '-' + currentyear;
    newDate = new Date(newDate);
    return newDate;
  }
  GetmmDDyyyFormat = (date: Date): string => {
    ;
    if (date) {
      return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    }
  }
  GetFirstDateOfYear2(currentyear) {
    // const currentyear = this.date.getFullYear();
    let newDate
    newDate = '01/01' + '/' + currentyear;
    newDate = new Date(newDate);
    return newDate;
  }
  GetLastMonthDate(month, year) {
  //  let lastMonthDate = new Date();
   // const month = lastMonthDate.getMonth();
   // const year = lastMonthDate.getFullYear();
    let day = new Date(year, month, 0).getDate();
    let lastMonthDate =  new Date(month + '/' + day + '/' + year);
    return lastMonthDate
  }
}
