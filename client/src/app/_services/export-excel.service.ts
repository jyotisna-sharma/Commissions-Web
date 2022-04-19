import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }
  /* 
CreatedBy:Acmeminds
CreatedOn:
Purpose:These methods are used for export a excel file when a list comes with Number value in Currency Field(Dollar)
*/
  // *******************************************************************************************************************************
  public exportAsExcelFile(json: any[], excelFileName: string, headerdata: any): void {
    const data = headerdata;
    const newheaderList = [];
    for (const headername of data) {
      newheaderList.push(headername);
    }
    let newJson = JSON.parse(JSON.stringify(json));
    newJson = this.OnConvertFormatofColumn(newJson, newheaderList);
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newJson, { header: newheaderList });

    let percentageColumnName = '';
    newheaderList.filter(columnName => {
      if (columnName) {
        if (json != null && json.length > 0 &&  json[0][columnName] && json[0][columnName].includes('%'))
    percentageColumnName = columnName;
  }

});

var range = XLSX.utils.decode_range(worksheet['!ref']);
for (var R = range.s.r + 1; R <= range.e.r; ++R) {
  for (var C = range.s.c; C <= range.e.c; ++C) {
    var cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
    if (cell && cell.t != 'n') {
      const value = cell.v;
      if (cell.t == 's' && value && value.includes("%")) {
        cell.t = 'n';
        cell.v = cell.v.replace("%", "");
        cell.v = Number(cell.v);
        cell.v = cell.v / 100;
        var fmt = '#.00%';
        cell.z = fmt;
      }
      else {
        continue;
      }
    } else if(cell){
      var fmt = '$#,##0.00 ;[Red]($#,##0.00)';
      cell.z = fmt;
    }
  } // only format numeric cells

}

let list: any = [];
list[excelFileName] = worksheet
const workbook: XLSX.WorkBook = { Sheets: list, SheetNames: [excelFileName] };

// var range = XLSX.utils.decode_range(worksheet['!ref']);
//R = range.s.r;
//// 
// for (C = range.s.c; C <= range.e.c; ++C) {
//   // 
//   const headerCell = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
//   if (headerCell && headerCell.t) {
//     worksheet[XLSX.utils.encode_cell({ c: C, r: R })].s = { font: { underline: true } };
//   }
// }
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true });
this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public OnConvertFormatofColumn(data: any = [], newheaderList: any = []) {
  data.map(item => {
    newheaderList.map(data => {
      // 
      if (data !== 'PolicyNumber' && item[data]) {
        //jyotisna  - Hard-coded check for policynumber to avoid changing numbers to dollar format - to be modified 
        item[data] = this.OnConvertStringToNumber(item[data])
      }
    });
  });
  return data;
}
  public OnConvertStringToNumber(value) {
  const isValueNumber = Number(value);
  if (!isNaN(isValueNumber)) {
    value = Number(value);
  }
  return value;
}
  // ###################################################################################################################################

  /* 
 CreatedBy:Acmeminds
 CreatedOn:
 Purpose:These methods are used for export a excel file when a list comes with currency  values in Currency Field(Dollar)
 */
  // ************************************************************************************************************************** 
  public exportAsExcelFileDollar(json: any[], excelFileName: string, headerdata: any): void {
  // 
  const data = headerdata;
  const newheaderList = [];
  for(const headername of data) {
    newheaderList.push(headername);
  }
    let newJson = JSON.parse(JSON.stringify(json));
  newJson = this.OnConvertFormatofColumnDollar(newJson, newheaderList);
  let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newJson, { header: newheaderList });
  let percentageColumnName = '';
  newheaderList.filter(columnName => {
    if (json != null && json[0][columnName] && json[0][columnName].includes('%'))
      percentageColumnName = columnName;
  });


  var range = XLSX.utils.decode_range(worksheet['!ref']);
  for(var R = range.s.r + 1; R <= range.e.r; ++R) {
  for (var C = range.s.c; C <= range.e.c; ++C) {
    var cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
    if (!cell || cell.t != 'n') {
      const value = cell.v;
      if (cell.t == 's' && value.includes("%")) {

        cell.t = 'n';
        cell.v = cell.v.replace("%", "");
        cell.v = Number(cell.v);
        cell.v = cell.v / 100;
        if (cell.v == 0) {
          var fmt = '0.00%';
          cell.z = fmt;
        } else {
          var fmt = '#.00%';
          cell.z = fmt;
        }

      }
      else {
        continue;
      }
    } else {
      var fmt = '$#,##0.00 ;[Red]($#,##0.00)';
      cell.z = fmt;
    }
  } // only format numeric cells

}

let list: any = [];
list[excelFileName] = worksheet
const workbook: XLSX.WorkBook = { Sheets: list, SheetNames: [excelFileName] };
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellDates: true });
this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public OnConvertFormatofColumnDollar(data: any = [], newheaderList: any = []) {
  data.map(item => {
    newheaderList.map(data => {
      if (item[data]) {
        item[data] = this.OnConvertStringToNumberDollar(item[data])
      }
    });
  });
  return data;
}
  public OnConvertStringToNumberDollar(value) {
  value = value.replace("$", '');
  value = value.replace(/,/g, '');
  value = value.replace("(", '-');
  value = value.replace(")", '');
  const isValueNumber = Number(value);
  if (!isNaN(isValueNumber)) {
    value = Number(value);
  }
  return value;
}
  // ##################################################################################################################################
  private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], {
    type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
}
}
