import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe extends DatePipe implements PipeTransform {
  datePipe: any = new DatePipe('en-US');

  transform(value: string, fomatType: any): any {
    let isDateValid: Boolean = false;
    try {
      if (this.datePipe.transform(value, fomatType, 'en-US')) {
        isDateValid = true;
      }
      return isDateValid;
    } catch (exception) {
      isDateValid = false;
      return isDateValid;
    }
  }

}

@Pipe({
  name: 'DateConversion'
})
export class ConvertToDateFormat extends DatePipe implements PipeTransform {
  datePipe: any = new DatePipe('en-US');
  dateFormatList: any = ['MMM-yyyy'];
  transform(value: string, fomatType: any): any {
    const date: string = new Date(value).toDateString();

    let modifiedDate: any = '';
    try {

      switch (fomatType) {
        case 'MMM-yyyy':
        case 'MMM-dd-yyyy':
        case 'MMM-dd-yy':
        case 'dd-MMM-yyyy':
          modifiedDate = this.datePipe.transform(value, fomatType, 'en-US');
          break;
        case 'dd-MM-yy':
        case 'dd-yy-MM':
        case 'MM-yy-dd':
        case 'MM-dd-yy':
        case 'yy-dd-MM':
        case 'MM-dd-yyyy':
        case 'yyyy-dd-MM':
        case 'dd-MM-yyyy':
        case 'yyyy-MM-dd':
          modifiedDate = new Date(this.datePipe.transform(value, fomatType, 'en-US'));
          if (!new Date(modifiedDate)) {
            modifiedDate = '';
          }
          break;
        default:
          modifiedDate = this.datePipe.transform(value, fomatType, 'en-US');
          break;
      }
      return modifiedDate;
    } catch (exception) {
      modifiedDate = '';
      return modifiedDate;
    }
  }

}
