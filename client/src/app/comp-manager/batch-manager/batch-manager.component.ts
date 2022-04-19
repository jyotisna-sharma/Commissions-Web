/* 
Author Name: Acmeminds
Number of Methods :23
ModifiedOn:Jan.03,2019 
*/
import { CalenderDataService } from './../../_services/calender-data.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { CompManagerService } from '../comp-manager.service';
import { CompManagerURLService } from '../comp-manager-url.service';
import { FormControl, FormGroup, } from '@angular/forms';
import { ResponseCode } from 'src/app/response.code';
import { MatDialog } from '@angular/material/dialog';
import { ServerURLS } from '../../../assets/config/CONSTANTS';
import { UploadFileComponent } from '../../_services/dialogboxes/upload-file/upload-file.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { CommonDataService } from '../../_services/common-data.service'
import { MultipleGridShownComponent } from '../../_services/dialogboxes/multiple-grid-shown/multiple-grid-shown.component';
import * as _ from 'lodash';
import { ChangeStatementDateComponent } from '../change-statement-date/change-statement-date.component';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-batch-manager',
  templateUrl: './batch-manager.component.html',
  styleUrls: ['./batch-manager.component.scss'],

})
export class BatchManagerComponent implements OnInit {
  batchList: MiProperties = new MiProperties();
  otherData: any;
  statementList: MiProperties = new MiProperties();
  batchListNeedRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  postdata: any;
  userDetail: any;
  todaydate: any = new Date();
  //batchCounts: any = 0;
  getBatchList: any;
  showloading: Boolean = false;
  isBatchNoteChange: Boolean = false;
  isPopAlreadyShown: Boolean = false;
  selectedBatch: any;

  statementData: [['PayorNickName', 'string'],
    ['StatmentNumber', 'number'],
    ['CheckAmountString', 'currency'],
    ['HouseString', 'currency'],
    ['RemainingString', 'currency'],
    ['DonePerString', 'currency'],
    ['Entries', 'number'],
    ['StmtStatusString', 'string']];
  isStatmentListShown: Boolean = false;
  yearFilters = [];
  monthsList = [];
  // batchListFiltered: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  //monthFilterType
  yearFilter = new FormControl('', {});
  // btchListData = new FormGroup({
  //   searchBatchData: new FormControl('', [])
  // })
  selectedMonth: any = [];
  searchData: any;
  isButtonDisabled: Boolean = false;
  isYearChange: Subject<boolean> = new Subject();
  currentYear: any = new Date();
  isMonthDropdownShow: Boolean = false;
  isSortingRefresh:  Subject<boolean>  = new Subject();
  constructor(
    public compMangrSvc: CompManagerService,
    public compManagerUrl: CompManagerURLService,
    public dialog: MatDialog,
    public commonService: CommonDataService,
    public calenderDataSvc: CalenderDataService,
  ) {
  }

  ngOnInit() {
    this.yearFilters = this.calenderDataSvc.GetLast5YearList(this.currentYear.getFullYear());
    this.selectedMonth = this.calenderDataSvc.GetMonthList();
    this.selectedMonth = this.selectedMonth.map(item => { return item.key });
    this.selectedMonth = this.OnSetAllSelectedMonths(this.selectedMonth);
    this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.isButtonDisabled = this.userDetail.Permissions[5].Permission === 1;
    this.yearFilter.setValue(this.todaydate.getFullYear());
    this.GetBatchList();
    this.GetBatchListPrmtrs();
  }
  /* ######################################################################################################################################## */
  OnSetAllSelectedMonths(list) {
    let data = "";
    list.filter(item => {
      data = data == "" ? item : data + ',' + item;
    });
    return data;
  }
  /* ######################################################################################################################################## */
  /* Title: Batch List Releated Methods
  AuthorName: ModifiedOn: 26-12-2019
  Purpose: Methods used for getting List and  take necessary action on menu click
  Number of Methods:9 */

  GetBatchList() {
    const url = this.compManagerUrl.BatchManager.GetBatchList;
    this.batchList.url = url;
    this.batchList.miDataSource = new TableDataSource(this.compMangrSvc);
    this.batchList.columnLabels = ['', 'Created', 'Batch #', 'Balance', 'Status', 'Batch Note', ''];
    this.batchList.displayedColumns = ['RadioButton', 'CreatedDateString', 'BatchNumber', 'Balance',
      'BatchEntryStatus', 'BatchNote', 'Action'];
    this.batchList.columnIsSortable = ['false', 'true', 'true', 'true', 'true', 'false', 'false'];
    this.batchList.refreshHandler = this.batchListNeedRefresh;
    this.batchList.resetPagingHandler = this.needPageReset;
    this.batchList.showPaging = true;
    this.batchList.miListMenu = new MiListMenu();
    this.batchList.pageSize = 10;
    this.batchList.initialPageIndex = 0;
    this.batchList.miListMenu.visibleOnDesk = true;
    this.batchList.isFirstRowSelected = true;
    this.batchList.isEditablegrid = true;
    this.batchList.fieldType = {
      // tslint:disable-next-line:max-line-length
      'BatchNote': new MiListFieldType('BatchNote', 'BatchNote', '', 'img-icons save-icn', 'input-button', true, 'Save Note', true, this.IsButtonDisabled, '', '', this),
      'RadioButton': new MiListFieldType('', 'RadioButton', '', '', 'radio-button', '', '', false, null, '', '', this),
    }
    this.batchList.miListMenu.menuItems =
      [
        new MiListMenuItem('Export', 3, true, false, null, 'img-icons export-icn'),
        new MiListMenuItem('View File', 3, true, false, null, 'img-icons view-icn'),
        new MiListMenuItem('Delete', 3, true, true, this.IsButtonDisabled, 'img-icons delete-icn')

      ];

    this.batchList.miDataSource.dataSubject.subscribe(isloadingdone => {

      if (isloadingdone && isloadingdone.length > 0) {

        this.isMonthDropdownShow = true;
        this.getBatchList = _.cloneDeep(this.batchList.miDataSource.tableData);
        this.isStatmentListShown = true;
        const firstRecordData = {
          'data': this.batchList.miDataSource.tableData[0]
        };
        this.isYearChange.next(true);
        this.GetStatementList();

        this.GetStatemnentListPrmtrs(firstRecordData);
        this.monthsList = this.batchList.miDataSource.getResponse.MonthList;
      }
      else if (isloadingdone && isloadingdone.length == 0) {
        this.isStatmentListShown = false;
      }
    });
  }
  /* ######################################################################################################################################## */
  OnFilterBatchListMonthly(selectedData) {
    this.isStatmentListShown = false;
    this.selectedMonth = this.OnSetAllSelectedMonths(selectedData.Month);
    this.isSortingRefresh.next(true);
    this.batchList.resetPagingHandler.next(true);
    this.GetBatchList();
    this.GetBatchListPrmtrs();
  }
  /* ######################################################################################################################################## */
  OnStatementListHide() {
    this.isStatmentListShown = false;
  }
  /* ######################################################################################################################################## */
  OnBatchMenuItemClick(clickedRecord) {
    
    this.selectedBatch = clickedRecord;
    if (clickedRecord.name === 'save') {
      
      this.getBatchList.filter(element => {
        if (element.BatchId === clickedRecord.data.BatchId) {
          
          // if (clickedRecord.data.BatchNote && element.BatchNote !== clickedRecord.data.BatchNote) {
          //   
          //   this.isPopAlreadyShown = false;
          //   this.isBatchNoteChange = true;
          // }
          // else if(clickedRecord.data.BatchNote == ''){
          //   
          //   this.isPopAlreadyShown = false;
          //   this.isBatchNoteChange = true;
          // }
          this.isPopAlreadyShown = false;
          this.isBatchNoteChange = true;
        }
      });
      
      this.postdata = {
        'batchNumber': clickedRecord.data.BatchNumber,
        'batchNote': clickedRecord.data.BatchNote
      };
      if (this.isBatchNoteChange === true) {
        
        this.showloading = true;
        this.compMangrSvc.SaveBatchNotes(this.postdata).subscribe(response => {
          
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            if (this.isPopAlreadyShown === false && this.isBatchNoteChange) {
              this.OpenSaveBatchNotedilog();
              this.isBatchNoteChange = false;
              this.getBatchList = _.cloneDeep(this.batchList.miDataSource.tableData);
            }
          }
        });
      }
    } else if (clickedRecord.name === 'View File') {
      
      this.ViewFile(clickedRecord.data);
    } else if (clickedRecord.name === 'Delete') {
      if (clickedRecord.data.EntryStatus === 8) {
        this.OnDeletePaidEntry('Batch');
      } else {
        if (this.statementList.miDataSource.tableData && this.statementList.miDataSource.tableData.length > 0) {
          this.OnBatchDeletionDilog();
        } else { this.openBatchDeleteDialogBox(clickedRecord.data); }
      }
    } else if (clickedRecord.name === 'Export') {
      this.ExportToExcel(clickedRecord.data.BatchId, clickedRecord.data.BatchNumber, clickedRecord.data.PayorNickName);
    }
  }
  /* ######################################################################################################################################## */
  GetBatchListPrmtrs() {
    this.postdata = {
      'licenseeId': this.userDetail.LicenseeId,
      'createdOn': this.yearFilter.value,
      'FilterBy': this.searchData,
      'monthFilter': this.selectedMonth
    }

    this.batchList.requestPostData = this.postdata;
    this.batchList.refreshHandler.next(true);
  }
  /* ######################################################################################################################################## */
  OnBatchDeletionDilog() {
    this.isPopAlreadyShown = true;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: 'Batch Deletion',
        subTitle: 'Batch cannot be deleted before statement.',
        isCommanFunction: true,
        numberofButtons: '1'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.showloading = false;
    });
  }
  /* ######################################################################################################################################## */
  OnDeletePaidEntry(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Alert',
        subTitle: (value !== '') ? ((value === 'Batch') ?
          'Please note that the selected batch cannot be deleted as it is marked "Paid".' :
          'Please note that the selected statement cannot be deleted as its batch is marked "Paid".') :
          'The selected entry cannot be deleted.',
        forceToDelete: false
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  /* ######################################################################################################################################## */
  openBatchDeleteDialogBox(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Batch',
        subTitle: ' Are you sure you want to delete selected batch?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'false') {
        this.showloading = true;
        this.postdata = {
          'batchId': value.BatchId,
          'userRole': this.userDetail.Role
        }
        this.compMangrSvc.DeleteBatch(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS && response.BoolFlag === true) {
            // this.isStatmentListShown = true;
            this.showloading = false;
            this.GetBatchList();
            this.GetBatchListPrmtrs();
          }
        });
      }
    });
  }
  /* ######################################################################################################################################## */
  OpenSaveBatchNotedilog() {
    this.isPopAlreadyShown = true;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: 'Batch Note Updated Successfully',
        subTitle: 'Batch note has been successfully updated in the system.',
        isCommanFunction: true,
        numberofButtons: '1'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.showloading = false;
    });
  }
  /* ######################################################################################################################################## */
  ViewFile(element) {
    
    const anchor = document.createElement('a');
    const fileExt = element.FileName.slice((element.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
    if (fileExt) {
      
      if (fileExt.toLowerCase() === 'pdf') {
        
        anchor.href = ServerURLS.PDFURL + element.FileName;
        anchor.target = '_blank';
      } else {
        anchor.href = ServerURLS.XLSURL + element.FileName;
      }
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      const dialogRef = this.dialog.open(SuccessMessageComponent, {
        data: {
          Title: 'File not available!',
          subTitle: 'Please note that no file is available for a manual commission dashboard entry.',
          buttonName: 'ok',
          isCommanFunction: false
        },
        width: '400px',
        disableClose: true,
      });
    }
  }
  /* ######################################################################################################################################## */
  /* Title: Statement List Releated Methods
    AuthorName: ModifiedOn: 26-12-2019
    Purpose: Methods used for getting List and  take necessary action on menu click
    Number of Methods: */
  GetStatementList() {
    const url = this.compManagerUrl.BatchManager.GetStatementList;
    this.statementList.url = url;
    this.statementList.miDataSource = new TableDataSource(this.compMangrSvc);
    this.statementList.columnLabels = ['Payor', 'Stmnt #', 'Stmnt Date', 'ChkAmt', 'House', 'Remaining', 'Done', 'Entries', 'Status', ''];
    this.statementList.displayedColumns = ['PayorNickName', 'StatmentNumber', 'StatementDateString', 'CheckAmountString',
      'HouseString', 'RemainingString', 'DonePerString', 'Entries', 'StmtStatusString', 'Action'];
    this.statementList.columnIsSortable = ['true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'false'];
    this.statementList.isFooterRequired = true;
    this.statementList.columnDataTypes = [['PayorNickName', 'string'],
    ['StatmentNumber', 'number'],
    ['CheckAmountString', 'currency'],
    ['StmtStatusString', 'date'],
    ['HouseString', 'currency'],
    ['RemainingString', 'currency'],
    ['DonePerString', 'currency'],
    ['Entries', 'number'],
    ['StmtStatusString', 'string']];
    //  this.statementList.isClientSideList = true;
    this.statementList.refreshHandler = new Subject();
    this.statementList.miListMenu = new MiListMenu();
    this.statementList.miListMenu.visibleOnDesk = true;
    this.statementList.isClientSideList = true;
    this.statementList.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit Stmnt Date', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('View Data', 3, true, false, null, 'img-icons view-icn'),
        new MiListMenuItem('Delete', 3, true, true, this.IsButtonDisabled, 'img-icons delete-icn')
      ];
  }
  /* ######################################################################################################################################## */
  GetStatemnentListPrmtrs(value) {
    this.selectedBatch = value;
    this.postdata = {
      'batchId': value.data.BatchId
    }
    this.statementList.requestPostData = this.postdata;
    this.statementList.refreshHandler.next(true);
  }
  /* ######################################################################################################################################## */
  OnStmtMenuItemClick(clickedRecord) {
    if (clickedRecord.name === 'Delete') {
      if (this.selectedBatch.data && this.selectedBatch.data.EntryStatus === 8) {
        this.OnDeletePaidEntry('Statement');
      } else if (clickedRecord.data.CheckAmount === null || clickedRecord.data.PayorNickName === 'Total:') {
        this.OnDeletePaidEntry('');
      } else {
        this.openStmtDeleteDialogBox(clickedRecord.data);
      }
    } else if (clickedRecord.name === 'View Data') {
      this.OpenInsuredPaymentDilog(clickedRecord);
    } else if (clickedRecord.name === 'Edit Stmnt Date') {
      this.ShownAlertMessage(clickedRecord['data']);
      // this.OnEditStatementDate(clickedRecord['data']);
    }
  }
  /* ######################################################################################################################################## */
  ShownAlertMessage(data) {
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Edit Statement Date',
        subTitle: 'Are you sure you want to edit the Statement Date?'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.showloading = true;
        this.OnEditStatementDate(data);
        this.showloading = false;
      } else {
        this.showloading = false;

      }
    });
  }
  /* ######################################################################################################################################## */
  OnEditStatementDate(rowData) {
    this.showloading = false;
    const dilogRef = this.dialog.open(ChangeStatementDateComponent, {
      data: {
        statementDetails: rowData,
        BatchDetails: this.selectedBatch.data
      },
      disableClose: true,
      width: '400px'
    });
    dilogRef.afterClosed().subscribe(result => {
      if (result) {
        const postData = {
          'statementDateString': result,
          'statementId': rowData.StatmentId
        }
        this.compMangrSvc.UpdateStatementDate(postData).subscribe(response => {
          if (response) {
            this.showloading = false;
            // this.statementList.refreshHandler.next(true);
          }
        });
      }
    });
  }
  /* ######################################################################################################################################## */
  OpenInsuredPaymentDilog(recordData) {
    this.otherData = {};
    const dilogRef = this.dialog.open(MultipleGridShownComponent, {
      data: {
        class: 'add-payees',
        isRowClickable: false,
        primaryButton: 'Ok',
        isPrimaryControl: false,
        isSecondryControl: false,
        columnLabels: ['Insured', 'Payment'],
        displayedColumns: ['ClientName', 'PaymentString'],
        columnIsSortable: ['true', 'true'],
        columnDataTypes: [['ClientName', 'string'],
        ['PaymentString', 'currency']],
        showPaging: false,
        title: 'Statement#' + ' ' + recordData.data.StatmentNumber,
        isCountHiden: true,
        isSecondListShown: true,
        listingURL: this.compManagerUrl.BatchManager.GetInsuredPaymentData,
        isClientSideList: true,
        isEditableGrid: false,
        isSearchNotShown: true,
        postData: {
          'statementId': recordData.data.StatmentId
        },
        secondGridData: {
          columnLabels: ['Payor', 'ChkAmt', 'House', 'Remaining', 'Done', 'Entries', 'Status'],
          displayedColumns: ['PayorNickName', 'CheckAmountString',
            'HouseString', 'RemainingString', 'DonePerString', 'Entries', 'StmtStatusString'],
          columnIsSortable: ['false', 'false', 'false', 'false', 'false', 'false', 'false'],
          cachedList: [recordData.data],
          isCountHiden: true,
          title: 'Payment Details'
        },
        otherData: this.otherData
      },
      disableClose: true,
      width: '800px'
    });
    dilogRef.afterClosed().subscribe(result => {
    });
  }
  /* ######################################################################################################################################## */
  openStmtDeleteDialogBox(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Statement',
        subTitle: ' Are you sure you want to delete selected statement?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'false') {
        this.showloading = true;
        this.postdata = {
          'statementId': value.StatmentId,
          'userRole': this.userDetail.Role
        }
        this.compMangrSvc.DeleteStatement(this.postdata).subscribe(response => {
          this.showloading = false;
          if (response.ResponseCode === ResponseCode.SUCCESS && response.BoolFlag === true) {
            this.statementList.refreshHandler.next(true);
          } else {
            return;
          }

        });
      }
    });
  }
  /* ######################################################################################################################################## */
  IsButtonDisabled() {
    this.userDetail = JSON.parse(localStorage.getItem('loggedUser'));
    return this.userDetail.Permissions[5].Permission === 1
  }
  /* ######################################################################################################################################## */
  OnChangeYearFilter(selectedYear) {
    this.isMonthDropdownShow = false;
    this.selectedMonth = this.calenderDataSvc.GetMonthList();
    this.selectedMonth = this.selectedMonth.map(item => { return item.key });
    this.selectedMonth = this.OnSetAllSelectedMonths(this.selectedMonth);
    this.yearFilter.setValue(selectedYear.value);
    this.isStatmentListShown = false;
    this.isSortingRefresh.next(true);
    this.batchList.resetPagingHandler.next(true);
    this.GetBatchList();
    this.GetBatchListPrmtrs();
  
  }
  /* ######################################################################################################################################## */
  ExportToExcel(batchId, batchNumber, payor) {
    // create list from datasource
    const list = []
    this.postdata = {
      'batchId': batchId,
      'batchNumber': batchNumber,
      'payorName': payor
    }
    this.compMangrSvc.GetBatchDataToExport(this.postdata).subscribe(response => {
        //this.commonService.exportBatchFile(response.BatchList);
        if (response.BatchList && response.BatchList.length > 0) {
          let list = [];
          const NumberColumnName = ['Premium', 'CommPercent', 'Units', 'Fee', 'SharePercent', 'TotalPayment',]
          list = response.BatchList;
          list.map(item => {
           
            for (let data of NumberColumnName) {
              const isNumber = Number(item[data]);
              if (!isNaN(isNumber)) {
                item[data] =  Number(item[data]);
              }
            }
          });
  
          this.commonService.exportBatchFile(list);
      } else {
        const dialogRef = this.dialog.open(SuccessMessageComponent, {
          width: '450px',
          data: {
            Title: 'No Data Available!',
            subTitle: 'Batch cannot be exported as it has no statements and payment entries yet.',
            isCommanFunction: true,
            numberofButtons: '1'
          },
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
      }
    })
  }
  /* ######################################################################################################################################## */
  OpenFileUploadDialog() {
    const dialogRef = this.dialog.open(UploadFileComponent, {
      width: '450px',
      data: {
        Title: 'Upload Batch',
        secondaryButton: 'Cancel',
        primaryButton: 'Ok'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isStatmentListShown = false;
        this.showloading = false;
        this.GetBatchList();
        this.GetBatchListPrmtrs();
      }
    });
  }
  // #######################################################################################################################################
  doSearch() {
    this.showloading = false;
    this.isStatmentListShown = false;
    this.batchList.resetPagingHandler.next(true);
    this.GetBatchListPrmtrs();
  }
  // #######################################################################################################################################
  handleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.doSearch();
    } else if (value.type === 'click') {
      this.searchData = '';
      this.doSearch();
    }
  }
  /* ######################################################################################################################################## */
}
