import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { PolicymanagerService } from '../policymanager.service';
import { FormControl } from '@angular/forms';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { PolicyManagerUrlService } from '../policy-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { ServerURLS } from '../../../assets/config/CONSTANTS'
import { ExportExcelService } from '../../_services/export-excel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { MatDialog } from '@angular/material/dialog';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { ResponseCode } from '../../response.code';
import { ResponseErrorService } from '../../_services/response-error.service';
import { Key } from 'protractor';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
export interface Sheets {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-import-policy',
  templateUrl: './import-policy.component.html',
  styleUrls: ['./import-policy.component.scss']
})

export class ImportPolicyComponent implements OnInit {
  isChangesInListing: Boolean = false;
  arrayBuffer: any;
  file: File;
  isFileValid: boolean;
  tableData: any;
  postdata: any;
  userdetails: any;
  sheetName: any;
  isButtonEnabled: Boolean = false;
  isselectSheetEnable: Boolean = false;
  isThirdTabEnabled: Boolean = false;
  isSceondTabEnabled: Boolean = false;
  isfirstTabEnabled: Boolean = true;
  selectedTabIndex: Number = 0;
  selectedViewDataIndex: Number = 2;
  isAccountNameExist: Boolean = false;
  isVisionPlanIdExist: Boolean = false;
  isOrignlEffctveDateExist: Boolean = false;
  SelectSheet = new FormControl('', {});
  headerData: any;
  validationMsg: any;
  sumofFirstYear: any = 0;
  sumofRenewableyear: any = 0;
  invalidColumnName: any;
  // invalidColumnNameList: any = [];
  isRecordDataShown: Boolean = false;
  showloader: Boolean = false;
  validationErrorObject: {};
  uploadText: any;
  isTableLoaderShown: Boolean = false;
  // --------------------------Count of Records-----------------------------------
  totalRecordsCount: any = 0;
  updateList: any = [];
  // ############################################################################
  totalRecords: any;
  inValidRecords: any;
  validRecords: any;
  distinctRecords: any;
  duplicateRecords: any = [];
  validRecordList: MiProperties = new MiProperties();
  inValidRecordList: MiProperties = new MiProperties();
  duplicateRecordList: MiProperties = new MiProperties();
  validRecordNeedRefresh: Subject<boolean> = new Subject();
  inValidRecordNeedRefresh: Subject<boolean> = new Subject();
  DuplicateRecordNeedRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  validColumnIsSortable: any;
  pagename: any;
  moduleName: any;
  excelsheetHeaders: any;
  validRecordListCount: any = 0;
  inValidRecordListCount: any = 0;
  failedList: any = [];
  successList: any = [];
  failedCount = 0;
  updateCount: any = 0
  successCount = 0;
  matToolTipText: any;
  ismatToolTipShown: Boolean = false;
  constructor(
    public policyMangrSVC: PolicymanagerService,
    public policyManagerUrl: PolicyManagerUrlService,
    public policyService: PolicymanagerService,
    public excelService: ExportExcelService,
    public route: Router,
    public location: Location,
    public getRouterParameter: GetRouteParamtersService,
    public activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    public error: ResponseErrorService,
    private http: HttpClient
  ) { }
  ngOnInit() {
    this.pagename = 'Import Policy';
    this.moduleName = 'Policy Manager';
    this.getRouterParameter.getparameterslist(this.activateRoute);
  }
  // ----------------------------------Used for  validating a file--------------------------------------------------------------------------
  OnValidateFile(event) {
    this.isFileValid = true;
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    const allowFileType = ['xls', 'xlsx'];
    this.file = event.target.files[0];
    let fileType;
    if (this.file && this.file.name) {
      fileType = this.file.name.substring(this.file.name.lastIndexOf('.') + 1);
    }
    if (this.file.size > 10000000) {
      this.isFileValid = false;
      this.validationMsg = 'The uploaded file exceeds the maximum size limit.'
      return;
    }
    for (const filetypeMatch of allowFileType) {
      if (filetypeMatch === fileType) {
        this.isFileValid = true;
        break;
      } else {
        this.isFileValid = false;
      }
    }
    if (this.isFileValid === true) {
      this.SelectedSheet(event)
    } else {
      this.isFileValid = false;
      this.validationMsg = 'Please select excel(.xls) file.';
      return;
    }
  }
  // #####################################################################################################################################
  OnSelectSheet() {
    this.SelectedSheetDataScan();
  }
  // -------------------------------------Used for shown a sheetName in select sheet dropdown-----------------------------------------------
  SelectedSheet(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      this.sheetName = workbook.SheetNames;
      if (this.sheetName && this.sheetName.length === 1) {
        this.SelectSheet.setValue(this.sheetName[0]);
        this.SelectedSheetDataScan();
      }
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  checkDuplicateInArray(a) {
    const counts = [];
    for (let i = 0; i <= a.length; i++) {
      if (counts[a[i]] === undefined) {
        counts[a[i]] = 1;
      } else {
        return true;
      }
    }
    return false;
  }
  // #####################################################################################################################################
  // -------------------------------------------Used for scan a selected sheet data-------------------------------------------------------
  SelectedSheetDataScan() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
      const worksheet = workbook.Sheets[this.SelectSheet.value];
      this.tableData = JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: false }));
      this.isButtonEnabled = true;
      this.isChangesInListing = true;
      if (this.tableData !== '[]') {
        this.headerData = this.GettingHeaderRow(worksheet);
        const newHeaderList = [];
        for (const headername of this.headerData) {
          if (headername.lastIndexOf('UNKNOWN') === -1) {
            newHeaderList.push(headername);
          }

        }

        // Check if header list has any duplicate column, then invalid template
        const isduplicate = this.checkDuplicateInArray(newHeaderList);
        if (isduplicate === true) {
          this.headerData = ''
          // this.isAccountNameExist = false
          // this.isVisionPlanIdExist = false;
        } else {
          this.headerData = newHeaderList;
        }

      } else {
        this.headerData = ''
        this.isAccountNameExist = false
        this.isVisionPlanIdExist = false;
        this.isOrignlEffctveDateExist = false;
      }
      this.excelsheetHeaders = this.headerData;
    }
    fileReader.readAsArrayBuffer(this.file);
  }
  // #############################################################################################################################
  // OnRedirectToFirstTab() {
  //   this.isfirstTabEnabled = true;
  //   this.isSceondTabEnabled = false;
  //   this.selectedTabIndex = 0;
  //   this.isButtonEnabled = false;
  //   this.isFileValid = false;
  // }
  // -----------------------------------Used for saving the policy details--------------------------------------------------------
  importPolicyDetails() {
    if (this.inValidRecords.length > 0) {
      this.OnShownConfirmationPopup();
    } else {
      this.uploadText = 'Please wait while we are importing records.';
      const formData = new FormData();
      this.showloader = true;
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.validRecords);
      const data = JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: false }));
      this.postdata = {
        'policiesData': data,
        'licenseeId': this.userdetails.LicenseeId
      };
      this.SendFileToServer();
      this.policyMangrSVC.ImportPolicy(this.postdata).subscribe(response => {
        this.showloader = false;
        this.isThirdTabEnabled = true;
        this.isSceondTabEnabled = false;
        this.selectedTabIndex = 2;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          if (response.ImportStatus && response.ImportStatus.ErrorCount > 0) {
            for (const failedRecord of response.ImportStatus.ErrorList) {
              for (const records of this.validRecords) {
                if (records['Plan ID'] === failedRecord) {
                  this.failedList.push(records);
                }
              }
            }
          } if (response.ImportStatus && response.ImportStatus.UpdateCount > 0) {
            for (const updatedRecord of response.ImportStatus.UpdateList) {
              for (const records of this.validRecords) {
                if (records['Plan ID'] === updatedRecord) {
                  this.updateList.push(records);
                }
              }
            }
          }
          if (response.ImportStatus && response.ImportStatus.ImportCount > 0) {
            for (const newRecord of response.ImportStatus.NewList) {
              for (const records of this.validRecords) {
                if (records['Plan ID'] === newRecord) {
                  this.successList.push(records);
                }
              }
            }
          }

          this.successCount = response.ImportStatus.ImportCount;
          this.failedCount = response.ImportStatus.ErrorCount;
          this.updateCount = response.ImportStatus.UpdateCount;
        } else {
          this.error.OpenResponseErrorDilog('Error Occured while importing a policy.');
        }
      });
    }
  }

  // ####################################################################################################################################
  // ------------------------------Used for scan data and enabled a second tab---------------------------------------------------------
  AfterScaningData(value) {
  
    if (this.isButtonEnabled) {
      this.uploadText = 'Please wait while we are validating records.';
      this.selectedTabIndex = 1;
      this.isfirstTabEnabled = false;
      if (this.headerData) {
        this.isAccountNameExist = this.headerData.some(item => item === 'Account Name');
       
        this.isVisionPlanIdExist = this.headerData.some(item => item === 'Plan ID');
        this.isOrignlEffctveDateExist = this.headerData.some(item => item === 'Original Plan Start Date');
      }
      this.isSceondTabEnabled = true;
      if (this.tableData) {
        this.totalRecordsCount = JSON.parse(this.tableData).length;
        this.totalRecords = JSON.parse(this.tableData);
      }
      if (this.isAccountNameExist && this.isVisionPlanIdExist && this.isOrignlEffctveDateExist) {
        this.showloader = true;
        const validRecords = [];
        const inValidRecords = [];
        this.GetDuplicateRecords();

        const excelData = this.distinctRecords; // JSON.parse(this.distinctRecords);
        excelData.filter(item => {
          const isInvalidRecord = this.OnValidateRecords(item);

          let data;
          data = item;
          if (Object.keys(item).length !== this.headerData.length) {
            const rowheader = (Object.keys(item));
            const unique1 = this.headerData.filter((o) => rowheader.indexOf(o) === -1);
            const unique2 = rowheader.filter((o) => this.headerData.indexOf(o) === -1);
            const unique = unique1.concat(unique2);
            for (const element of unique) {
              data[element] = ''
            }
          }
         
          if (isInvalidRecord && isInvalidRecord.length > 0) {
            data.invalidColumn = isInvalidRecord;
            inValidRecords.push(data);
          } else {
            validRecords.push(data);
          }
        });

        this.validRecords = validRecords;
        this.inValidRecords = inValidRecords;
        // this.totalRecords = JSON.parse(this.tableData);
        //  this.GetDuplicateRecords();
        const newlist = [];
        for (const data of this.inValidRecords) {
          data.isinputclick = false;
          data.clickedColumnName = '';
          data.isdateClicked = false;
          newlist.push(data);
        }
        this.inValidRecords = newlist;
        this.isRecordDataShown = true;
        this.GetIsSortableColumns();
        this.GetInValidRecordList();
        this.GetValidRecordList();
      }
    }
  }
 SendFileToServer() {
    const formData = new FormData();
    const file = this.file;
    const key = 'uploadData';
    formData.append(key, file);
    formData.append('fileName', file, this.file.name);
    const url = this.policyManagerUrl.PolicicyManagerListing.ImportpolicyFileUpload;
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });
    this.http.request(req).subscribe(event => {
      if (event instanceof HttpResponse) {
return;
      }
    });
  }
  // ######################################################################################################################################
  GetDuplicateRecords() {
    const testObject = {};
    const records = [];
    if (this.totalRecords && this.totalRecords.length > 0) {
      // Get all duplicate IDs
      this.totalRecords.map(item => {
        const itemPropertyName = item['Plan ID'];
        if (itemPropertyName in testObject) {
          // testObject[itemPropertyName].duplicate = true;
          if (records.indexOf(itemPropertyName) === -1) {
            records.push(itemPropertyName);
          }
          //    records.push(item);
        } else {
          testObject[itemPropertyName] = item;
          delete item.duplicate;
        }
      });

      // Seggregate lists based on duplicate IDs
      const getAllduplicateRecords = [];
      const getAllValidRecords = [];
      const isValid = true;
      if (records && records.length > 0) {

        for (const recValid of this.totalRecords) {
          const duplicateID = recValid['Plan ID'];
          let isDuplicate = false;
          if (records && records.length > 0) {
            for (const recorddata of records) {
              if (recorddata === duplicateID) {
                isDuplicate = true;
                getAllduplicateRecords.push(recValid);
              }
            }
            if (isDuplicate === false) {
              getAllValidRecords.push(recValid);
            }
          } else {
            getAllValidRecords.push(recValid);
          }
        }


        /* for (const recorddata of records) {
           const duplicateID = recorddata;
           for (const recValid of this.totalRecords) {
               if(recValid['Plan ID'] === duplicateID){
                 getAllduplicateRecords.push(recValid);
               }
               else{
                 let exists = getAllValidRecords.filter(item => {
                   return (item['Plan ID'] === duplicateID);  })
                   if(exists && exists.length === 0)
                     getAllValidRecords.push(recValid);
               }
           }
         }*/
        this.duplicateRecords = getAllduplicateRecords;
        this.distinctRecords = getAllValidRecords;
      } else {
        this.distinctRecords = this.totalRecords;
      }

      // //Refresh invalid records list - remove duplicate IDs from invalid list
      // for (const recorddata of this.inValidRecords) {
      //   const ID = recorddata['Plan ID'] ;
      // }


    }
  }
  // -------------------------------This method is used for getting the header of sheet-----------------------------------------------------
  GettingHeaderRow(sheet) {
    const headers = [];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    let C;
    const R = range.s.r;
    for (C = range.s.c; C <= range.e.c; ++C) {
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
      let hdr = 'UNKNOWN ' + C;
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
      }
      headers.push(hdr);
    }
    return headers;
  }
  // #########################################################################################################################
  OnValidateNumber(value) {
    let data = value;
    data = data.replace('$', '');
    data = data.replace('%', '');
    data = Number(data);
    if (isNaN(data)) {
      return false;
    } else {
      return true;
    }
  }
  // #########################################################################################################################
  GetValidRecordList() {
    const url = this.policyManagerUrl.PolicicyManagerListing.GetCachedList
    this.validRecordList.cachedList = this.validRecords;
    this.validRecordList.url = url;
    this.validRecordList.miDataSource = new TableDataSource(this.policyMangrSVC);
    this.validRecordList.columnLabels = this.headerData
    this.validRecordList.displayedColumns = this.headerData;
    this.validRecordList.columnIsSortable = this.validColumnIsSortable;
    this.validRecordList.miListMenu = new MiListMenu();
    this.validRecordList.miListMenu.visibleOnDesk = true;
    this.validRecordList.miListMenu.visibleOnMob = false;
    this.validRecordList.refreshHandler = this.validRecordNeedRefresh;
    this.validRecordList.resetPagingHandler = this.needPageReset;
    this.validRecordList.isClientSideList = false;
    this.validRecordList.isRowClickable = false;
    this.validRecordList.showPaging = true;
    this.validRecordList.isClientSidePagination = true;
    this.validRecordList.miDataSource.dataSubject.subscribe(isloadindDone => {
      if (isloadindDone && isloadindDone.length > 0) {
        this.validRecordListCount = this.validRecordList.miDataSource.tableData.length;
        this.showloader = false;
        this.isTableLoaderShown = true;
      } else if (isloadindDone && this.validRecordList.miDataSource.tableData
        && this.validRecordList.miDataSource.tableData.length === 0) {
        this.showloader = false;
        this.isTableLoaderShown = true;
      }
    });
  }
  GetInValidRecordList() {
    const url = this.policyManagerUrl.PolicicyManagerListing.GetCachedList
    this.inValidRecordList.cachedList = this.inValidRecords;
    this.inValidRecordList.url = url;
    this.inValidRecordList.miDataSource = new TableDataSource(this.policyMangrSVC);
    this.inValidRecordList.columnLabels = this.headerData
    this.inValidRecordList.displayedColumns = this.headerData;
    this.inValidRecordList.columnIsSortable = this.validColumnIsSortable;
    this.inValidRecordList.miListMenu = new MiListMenu();
    this.inValidRecordList.showPaging = true;
    this.inValidRecordList.miListMenu.visibleOnDesk = true;
    this.inValidRecordList.miListMenu.visibleOnMob = false;
    this.inValidRecordList.isClientSidePagination = true;
    this.inValidRecordList.refreshHandler = this.inValidRecordNeedRefresh;
    this.inValidRecordList.resetPagingHandler = this.needPageReset;
    this.inValidRecordList.isEditablegrid = true;
    this.inValidRecordList.miDataSource.dataSubject.subscribe(isloadindDone => {
      if (isloadindDone && isloadindDone.length > 0) {
        this.inValidRecordListCount = this.inValidRecordList.miDataSource.tableData.length;
        this.showloader = false;
        this.isTableLoaderShown = true;
      } else if (isloadindDone && this.inValidRecordList.miDataSource.tableData
        && this.inValidRecordList.miDataSource.tableData.length === 0) {
        this.inValidRecordListCount = this.inValidRecordList.miDataSource.tableData.length;
        this.showloader = false;
        this.isTableLoaderShown = true;
      }
    });
  }
  GetIsSortableColumns() {

    const data = [];
    for (const record of this.headerData) {
      data.push('true')
    }
    this.validColumnIsSortable = data;
  }

  DownloadTemplate() {
    const anchor = document.createElement('a');
    anchor.href = ServerURLS.ImportPolicyTemplate
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  exportAsXLSX(recordList, name) {
    const newList = [];
    const list = JSON.parse(JSON.stringify(recordList));
    for (const data of list) {
      delete data['invalidColumn']
      delete data['isdateClicked']
      delete data['isinputclick']
      delete data['clickedColumnName']
      delete data['isrowclick']
      newList.push(data);
    }
    this.excelService.exportAsExcelFile(newList, name, Object.assign(this.excelsheetHeaders));
  }
  OnPageRedirection() {
    this.isChangesInListing = false;
    const dilogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Import Policies',
        // tslint:disable-next-line:max-line-length
        subTitle: 'Are you sure you want to cancel the import process?',
      },
      width: '450px',
      disableClose: true,
    });
    dilogRef.afterClosed().subscribe(result => {
      if (result) {
        this.route.navigate(['/policy/policyListing',
          this.getRouterParameter.parentTab, this.getRouterParameter.pageSize, this.getRouterParameter.pageIndex]);
      }
    });

  }
  OnPageRedirectionClick(value) {
    if (value === 'cancel') {
      this.isChangesInListing = false;
    }
    this.route.navigate(['/policy/policyListing',
      this.getRouterParameter.parentTab, this.getRouterParameter.pageSize, this.getRouterParameter.pageIndex]);
  }
  onInputclick(recordData) {
   
    if (recordData.columnName !== 'Original Plan Start Date' && recordData.columnName !== 'Track From' && recordData.columnName !== 'Plan End Date') {
      if (recordData.data['Original Plan Start Date']) {
        let date = recordData.data['Original Plan Start Date'];
        date = new Date(date);
        recordData.data['Original Plan Start Date'] = this.mmDDyyyFormat(date)
      }
      if (recordData.data['Track From']) {
        let date = recordData.data['Track From'];
        date = new Date(date);
        recordData.data['Track From'] = this.mmDDyyyFormat(date);
      }
      if (recordData.data['Plan End Date']) {
        let date = recordData.data['Plan End Date'];
        date = new Date(date);
        recordData.data['Plan End Date'] = this.mmDDyyyFormat(date);
      }
    }
    recordData.data.clickedColumnName = recordData.columnName;
    recordData.data.isrowclick = !recordData.data.isrowclick;
    if (recordData.columnName === 'Original Plan Start Date'
      || recordData.columnName === 'Track From' || recordData.columnName === 'Plan End Date') {
     
      if (recordData.data[recordData.columnName]) {
        recordData.data[recordData.columnName] = new Date(recordData.data[recordData.columnName]);
        if (isNaN(recordData.data[recordData.columnName].getFullYear())) {
          recordData.data[recordData.columnName] = new Date();
        }
        recordData.data.isdateClicked = !recordData.data.isdateClicked;
      }
      else {
        recordData.data[recordData.columnName] = new Date();
        recordData.data.isdateClicked = !recordData.data.isdateClicked;
      }
    } else {
      recordData.data.isdateClicked = false;
    }
  }
  mmDDyyyFormat = (date: Date): string => {
    if (date) {
      let datelength;
      datelength = date.getFullYear();
      if (datelength) {
        datelength = datelength.toString();
        if (datelength.length === 4) {
          datelength = datelength.slice(-2);
        }
        return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + datelength);
      }
    }
  }
  OnUpdateInvalidData() {
    const newInavlidList = [];
    this.inValidRecords.filter(item => {
      const isInvalidRecord = this.OnValidateRecords(item);
     
      item.invalidColumn = isInvalidRecord;
      if (isInvalidRecord && isInvalidRecord.length > 0) {
        newInavlidList.push(item);
      } else {
        this.validRecords.push(item);
      }
    });
    this.inValidRecords = newInavlidList;
    this.inValidRecordList.cachedList = newInavlidList;
    this.validRecordList.refreshHandler.next(true);
    this.inValidRecordList.refreshHandler.next(true);
  }
  // -------------------------------Validate a records for finding valid and invalid records----------------------------------------------
  OnValidateRecords(recordData) {

    let status = true;
    let invalidColumnNameList = [];
    if (!recordData['Plan ID']) {
      this.invalidColumnName = 'Plan ID';
      invalidColumnNameList.push(this.invalidColumnName);
      // return false;
    }
    if (!recordData['Account Name']) {
      this.invalidColumnName = 'Account Name';
      invalidColumnNameList.push(this.invalidColumnName);
    }
    if (!recordData['Original Plan Start Date']) {
      this.invalidColumnName = 'Original Plan Start Date';
      invalidColumnNameList.push(this.invalidColumnName);
    }
    if (recordData['Original Plan Start Date']) {
      const date = new Date(recordData['Original Plan Start Date']);
      if (isNaN(date.getFullYear())) {
        this.invalidColumnName = 'Original Plan Start Date';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Original Plan Start Date']) {
      const date = new Date(recordData['Original Plan Start Date']);
      if (isNaN(date.getFullYear())) {
        this.invalidColumnName = 'Original Plan Start Date';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Track From']) {
      const date = new Date(recordData['Track From']);
      if (isNaN(date.getFullYear())) {
        this.invalidColumnName = 'Track From';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Modal Premium']) {
      status = this.OnValidateNumber(recordData['Modal Premium']);
      if (status === false) {
        this.invalidColumnName = 'Modal Premium';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Number of Covered Lives']) {
      status = this.OnValidateNumber(recordData['Number of Covered Lives']);
      if (status === false) {
        this.invalidColumnName = 'Number of Covered Lives';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Eligible']) {
      status = this.OnValidateNumber(recordData['Eligible']);
      if (status === false) {
        this.invalidColumnName = 'Eligible';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Plan End Date']) {
      const date = new Date(recordData['Plan End Date']);
      if (isNaN(date.getFullYear())) {
        this.invalidColumnName = 'Plan End Date';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Commissions - First Year %']) {
      status = this.OnValidateNumber(recordData['Commissions - First Year %']);
      if (status === false) {
        this.invalidColumnName = 'Commissions - First Year %';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Commissions - Renewal %']) {
      status = this.OnValidateNumber(recordData['Commissions - Renewal %']);
      if (status === false) {
        this.invalidColumnName = 'Commissions - Renewal %';
        invalidColumnNameList.push(this.invalidColumnName);
      }

    }
    if (recordData['Co Broker Split']) {
      status = this.OnValidateNumber(recordData['Co Broker Split']);
      if (status === false) {
        this.invalidColumnName = 'Co Broker Split';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
    if (recordData['Advanced Payment Number']) {
      status = this.OnValidateNumber(recordData['Advanced Payment Number']);
      if (status === false) {
        this.invalidColumnName = 'Advanced Payment Number';
        invalidColumnNameList.push(this.invalidColumnName);
      }
    }
   
    this.OnAddingProducerSum(recordData, invalidColumnNameList);
   
    if (this.sumofFirstYear > 100 || this.sumofRenewableyear > 100) {
      if (this.sumofFirstYear > 100) {
        let count = 1;
        for (const data of this.headerData) {
          const columName = 'Producer' + ' ' + count + ' ' + 'First Year %'
          if (data.indexOf(columName) === 0) {
            if (recordData[columName]) {
              invalidColumnNameList.push(columName);
            }
            count++;
          }
        }
      }
      if (this.sumofRenewableyear > 100) {
        let count = 1;
        for (const data of this.headerData) {
          const columName = 'Producer' + ' ' + count + ' ' + 'Renewal %'
          if (data.indexOf(columName) === 0) {
            if (recordData[columName]) {
              invalidColumnNameList.push(columName);
            }
            count++;
          }
        }
      }
    }
    return invalidColumnNameList;
  }
  // #########################################################################################################################
  OnAddingProducerSum(recordData, invalidColumnNameList) {
    let firstyearCount = 1;
    let renewableCount = 1;
    this.sumofFirstYear = 0;
    this.sumofRenewableyear = 0;
    for (const data of this.headerData) {
      const FirstYearPercentage = 'Producer' + ' ' + firstyearCount + ' ' + 'First Year %';
      const RenewalPercentage = 'Producer' + ' ' + renewableCount + ' ' + 'Renewal %';
      if (data === FirstYearPercentage) {
        if (recordData[FirstYearPercentage]) {
          if (recordData[FirstYearPercentage] > 100) {
            this.invalidColumnName = FirstYearPercentage;
            invalidColumnNameList.push(this.invalidColumnName);
          } else {
            this.sumofFirstYear += Number(recordData[FirstYearPercentage])
          }
        }
        firstyearCount++;
      }
      if (data === RenewalPercentage) {
        if (recordData[RenewalPercentage]) {
          if (recordData[RenewalPercentage] > 100) {
            this.invalidColumnName = RenewalPercentage;
            invalidColumnNameList.push(this.invalidColumnName);
          } else {
            this.sumofRenewableyear += Number(recordData[RenewalPercentage])
          }
        }
        renewableCount++;
      }
    }
    // if (recordData['Producer 1 First Year %']) {
    //   status = this.OnValidateNumber(recordData['Producer 1 First Year %']);
    //   if (status === false || recordData['Producer 1 First Year %'] > 100) {
    //     this.invalidColumnName = 'Producer 1 First Year %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofFirstYear = Number(recordData['Producer 1 First Year %'])
    //   }
    // }
    // if (recordData['Producer 1 Renewal %']) {
    //   status = this.OnValidateNumber(recordData['Producer 1 Renewal %']);
    //   if (status === false || recordData['Producer 1 Renewal %'] > 100) {
    //     this.invalidColumnName = 'Producer 1 Renewal %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofRenewableyear = Number(recordData['Producer 1 Renewal %'])
    //   }
    // }
    // if (recordData['Producer 2 First Year %']) {
    //   status = this.OnValidateNumber(recordData['Producer 2 First Year %']);
    //   if (status === false || recordData['Producer 2 First Year %'] > 100) {
    //     this.invalidColumnName = 'Producer 2 First Year %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofFirstYear += Number(recordData['Producer 2 First Year %'])
    //   }
    // }
    // if (recordData['Producer 2 Renewal %']) {
    //   status = this.OnValidateNumber(recordData['Producer 2 Renewal %']);
    //   if (status === false || recordData['Producer 2 Renewal %'] > 100) {
    //     this.invalidColumnName = 'Producer 2 Renewal %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofRenewableyear += Number(recordData['Producer 2 Renewal %'])
    //   }
    // }
    // if (recordData['Producer 3 First Year %']) {
    //   status = this.OnValidateNumber(recordData['Producer 3 First Year %']);
    //   if (status === false || recordData['Producer 3 First Year %'] > 100) {
    //     this.invalidColumnName = 'Producer 3 First Year %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofFirstYear += Number(recordData['Producer 3 First Year %'])
    //   }
    // }
    // if (recordData['Producer 3 Renewal %']) {
    //   status = this.OnValidateNumber(recordData['Producer 3 Renewal %']);
    //   if (status === false || recordData['Producer 3 Renewal %'] > 100) {
    //     this.invalidColumnName = 'Producer 3 Renewal %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofRenewableyear += Number(recordData['Producer 3 Renewal %'])
    //   }
    // }
    // if (recordData['Producer 4 First Year %']) {
    //   status = this.OnValidateNumber(recordData['Producer 4 First Year %']);
    //   if (status === false || recordData['Producer 4 First Year %'] > 100) {
    //     this.invalidColumnName = 'Producer 4 First Year %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofFirstYear += Number(recordData['Producer 4 First Year %'])
    //   }
    // }
    // if (recordData['Producer 4 Renewal %']) {
    //   status = this.OnValidateNumber(recordData['Producer 4 Renewal %']);
    //   if (status === false || recordData['Producer 4 Renewal %'] > 100) {
    //     this.invalidColumnName = 'Producer 4 Renewal %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofRenewableyear += Number(recordData['Producer 4 Renewal %'])
    //   }
    // }
    // if (recordData['Producer 5 First Year %']) {
    //   status = this.OnValidateNumber(recordData['Producer 5 First Year %']);
    //   if (status === false || recordData['Producer 5 First Year %'] > 100) {
    //     this.invalidColumnName = 'Producer 5 First Year %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofFirstYear += Number(recordData['Producer 5 First Year %'])
    //   }
    // }
    // if (recordData['Producer 5 Renewal %']) {
    //   status = this.OnValidateNumber(recordData['Producer 5 Renewal %']);
    //   if (status === false || recordData['Producer 5 Renewal %'] > 100) {
    //     this.invalidColumnName = 'Producer 5 Renewal %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofRenewableyear += Number(recordData['Producer 5 Renewal %'])
    //   }
    // }
    // if (recordData['Producer 6 First Year %']) {
    //   status = this.OnValidateNumber(recordData['Producer 6 First Year %']);
    //   if (status === false || recordData['Producer 6 First Year %'] > 100) {
    //     this.invalidColumnName = 'Producer 6 First Year %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofFirstYear += Number(recordData['Producer 6 First Year %'])
    //   }
    // }
    // if (recordData['Producer 6 Renewal %']) {
    //   status = this.OnValidateNumber(recordData['Producer 6 Renewal %']);
    //   if (status === false || recordData['Producer 6 Renewal %'] > 100) {
    //     this.invalidColumnName = 'Producer 6 Renewal %';
    //     invalidColumnNameList.push(this.invalidColumnName);
    //   } else {
    //     this.sumofRenewableyear += Number(recordData['Producer 6 Renewal %'])
    //   }
    // }

  }

  OnShownConfirmationPopup() {
    const dilogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Import Policies',
        // tslint:disable-next-line:max-line-length
        subTitle: 'Please note that there exists data in invalid tab and only the data in valid tab will be imported. Are you sure you want to import data of valid tab only?',
      },
      width: '450px',
      disableClose: true,
    });
    dilogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadText = 'Please wait while we are importing a records.';
        const formData = new FormData();
        this.showloader = true;
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.validRecords);
        const data = JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: false }));
        this.postdata = {
          'policiesData': data,
          'licenseeId': this.userdetails.LicenseeId
        };
        this.policyMangrSVC.ImportPolicy(this.postdata).subscribe(response => {
          this.showloader = false;
          this.isThirdTabEnabled = true;
          this.isSceondTabEnabled = false;
          this.selectedTabIndex = 2;
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.showloader = false;
            this.isThirdTabEnabled = true;
            this.isSceondTabEnabled = false;
            this.selectedTabIndex = 2;
            if (response.ResponseCode === ResponseCode.SUCCESS) {
              if (response.ImportStatus && response.ImportStatus.ErrorCount > 0) {
                for (const failedRecord of response.ImportStatus.ErrorList) {
                  for (const records of this.validRecords) {
                    if (records['Plan ID'] === failedRecord) {
                      this.failedList.push(records);
                      this.failedCount = this.failedList.length;
                    }
                  }
                }
              } if (response.ImportStatus && response.ImportStatus.UpdateCount > 0) {
                for (const updatedRecord of response.ImportStatus.UpdateList) {
                  for (const records of this.validRecords) {
                    if (records['Plan ID'] === updatedRecord) {
                      this.updateList.push(records);
                    }
                  }
                }
              }
              if (response.ImportStatus && response.ImportStatus.ImportCount > 0) {
                for (const newRecord of response.ImportStatus.NewList) {
                  for (const records of this.validRecords) {
                    if (records['Plan ID'] === newRecord) {
                      this.successList.push(records);
                    }
                  }
                }
              }
              this.successCount = response.ImportStatus.ImportCount;
              this.failedCount = response.ImportStatus.ErrorCount;
              this.updateCount = response.ImportStatus.UpdateCount;
            }
          } else {
            this.error.OpenResponseErrorDilog('Error Occured while importing a policy.');
          }
        });
      }
    });
    }
  // #########################################################################################################################
  
}
