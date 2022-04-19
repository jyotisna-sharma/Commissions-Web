/* 
AuthorName:Acmeminds
ModifiedOn:06 Jan,2020
Number of Methods:
Purpose:Change the month filter structure
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from '../../_services/table.datasource';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { ResponseCode } from 'src/app/response.code';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ReportManagerService } from '../report-manager.service';
import { ReportManagerURLService } from '../report-manager-url.service';
import { Guid } from 'guid-typescript';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ServerURLS } from '../../../assets/config/CONSTANTS';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ResponseErrorService } from '../../_services/response-error.service';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { MarkedPaidBatchListComponent } from '../../_services/dialogboxes/marked-paid-batch-list/marked-paid-batch-list.component';
import { CalenderDataService } from './../../_services/calender-data.service';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { EmailDialogComponent } from '../../_services/dialogboxes/email-dialog/email-dialog.component';
import { Observable, forkJoin } from 'rxjs';
@Component({
  selector: 'app-payee-report-listing',
  templateUrl: './payee-report-listing.component.html',
  styleUrls: ['./payee-report-listing.component.scss']
})
export class PayeeReportListingComponent implements OnInit {
  isArison: boolean = JSON.parse(localStorage.getItem('loggedUser')).LicenseeId == CONSTANTS.arisonId;
  title: any = 'Report Manager';
  showLoader = false;
  BatchDetailsListProperties: MiProperties = new MiProperties();
  PayeeListProperties: MiProperties = new MiProperties();
  ReportNameProperties: MiProperties = new MiProperties();
  SegmentListProperties: MiProperties = new MiProperties();
  needBatchlistRefresh: Subject<boolean> = new Subject();
  needpayeelistRefresh: Subject<boolean> = new Subject();
  needsegmentlistRefresh: Subject<boolean> = new Subject();
  needReportNameRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  isYearChange:  Subject<boolean> = new Subject();
  //Subject<boolean> = new Subject();
  url: any;
  EmailIds: any;
  userdetails: any;
  batches: any;
  batchList: any;
  filteredMonthList: any;
  payees: any;
  segments: any;
  reportName: any;
  postdata: any;
  isBatchListfound: Boolean = false;
  isPayeeListfound: Boolean = false;
  isSegmentListfound: Boolean = false;
  // ---------------------Count Initalization-------------------
  batchCount: any = 0;
  ReportCount: any = 0;
  PayeeCount: any = 0;
  SegmentCount: any = 0;
  // ###############################################################################################################################
  // -----------------Select all functionality Variables  used-------------------
  batchAllCheckBoxSelect = false;
  payeeAllCheckBoxSelect = false;
  segmentAllCheckBoxSelect = false;
  reportAllCheckBoxSelect = false;
  // ###############################################################################################################################
  isBatchSelected: Boolean = false;
  isPayeeSelected: Boolean = false;
  isSegmentSelected: Boolean = false;
  isReportSelected: Boolean = false;
  isMonthShown: Boolean = false;
  StatusFilter: FormGroup;
  ListFilters = new FormGroup({
    mainFilter: new FormControl('Unpaid', [])
  });
  selectedMonth: any;
  // isFilterChange: Subject<boolean> = new Subject();

  // searchDataFilter: any = 'All';
  isZero = new FormControl(false, []);
  isSubTotal = new FormControl(false, []);
  statusFilters = [
    {
      key: 2, value: 'Unpaid',
    },
    {
      key: 1, value: 'Paid',
    },
    {
      key: 0, value: 'All'
    },
  ];
  mainFilterList = [{ key: 0, value: 'Paid' }, { key: 1, value: 'Unpaid' }, { key: 2, value: 'Partial Unpaid' }, { key: 3, value: 'All' }];
  monthsFilters = [];
  batchListColumnTypes = [['CreatedDateString', 'date'],
  ['BatchNumber', 'number'],
  ['Year', 'number'],
  ['Status', 'string']
  ];
  isBatchPaid: Boolean = false;
  
  constructor(
    public getRouterparamter: GetRouteParamtersService,
    public reportManagersvc: ReportManagerService,
    public reportManagerURLSvc: ReportManagerURLService,
    public fb: FormBuilder,
    public dialog: MatDialog,
    public error: ResponseErrorService,
    public calenderSvc: CalenderDataService
  ) {

  }
  ngOnInit() {
    this.monthsFilters = this.calenderSvc.GetMonthList();
    this.monthsFilters = this.monthsFilters && this.monthsFilters.map(item => {
      return {
        Month: item.key,
        MonthName: item.value
      };
    });
    this.isSubTotal.disable();
    this.SetYearFilter();
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.userdetails.Permissions[6].Permission === 1;
    this.GetReportNameListing();
    this.ReportNameListingPrmtrs();
    //this.isBatchPaid = false;
  }


  // ###############################################################################################################################
  OnChangeSubTotal(result) {
    this.isSubTotal.setValue(result.checked);
  }
  // ###############################################################################################################################
  OnChangeIszero(result) {
    this.isZero.setValue(result.checked);
  }
  // ###############################################################################################################################
  SetYearFilter() {
    this.StatusFilter = this.fb.group({
      statusFilterType: new FormControl('Unpaid')
    });
    let year;
    year = new Date();
    year = year.getFullYear();
    const yearLength = this.calenderSvc.GetLast5YearList(new Date().getFullYear()).length;
    for (let index = 0; index < yearLength; index++) {
      this.mainFilterList.push(this.calenderSvc.GetLast5YearList(new Date().getFullYear())[index]);
    };
  }
  // ###############################################################################################################################
  GetBatchesListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetBatchesList;
    this.BatchDetailsListProperties.url = this.url
    this.BatchDetailsListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.BatchDetailsListProperties.displayedColumns = ['Checkbox', 'CreatedDateString', 'BatchNumber', 'Year', 'Status'];
    this.BatchDetailsListProperties.columnLabels = ['Checkbox', 'Date', 'Batch', 'Year', 'Status'];
    this.BatchDetailsListProperties.columnIsSortable = ['false', 'true', 'true', 'true', 'true'];
    this.BatchDetailsListProperties.columnDataTypes = this.batchListColumnTypes;
    this.BatchDetailsListProperties.refreshHandler = this.needBatchlistRefresh;
    this.BatchDetailsListProperties.resetPagingHandler = this.needPageReset;
    this.BatchDetailsListProperties.miListMenu = new MiListMenu();
    this.BatchDetailsListProperties.miListMenu.visibleOnDesk = true;
    this.BatchDetailsListProperties.miListMenu.visibleOnMob = false;
    this.BatchDetailsListProperties.showPaging = false;
    this.BatchDetailsListProperties.pageSize = this.getRouterparamter.pageSize
    this.BatchDetailsListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.BatchDetailsListProperties.isEditablegrid = true;
    this.BatchDetailsListProperties.isClientSideList = true;
    this.BatchDetailsListProperties.clientSideSearch = this.searchList;
    this.BatchDetailsListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    this.BatchDetailsListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0 || (this.BatchDetailsListProperties.miDataSource.getResponse && this.BatchDetailsListProperties.miDataSource.getResponse.TotalLength == 0)) {
        //alert("in");
        //alert("isloadingDone.length="+isloadingDone.length);
        //alert("this.BatchDetailsListProperties.miDataSource.getResponse.TotalLength="+this.BatchDetailsListProperties.miDataSource.getResponse.TotalLength);
        this.isBatchListfound = true;
        this.batchList = this.BatchDetailsListProperties.miDataSource.getResponse.TotalRecords;
        this.batchCount = this.BatchDetailsListProperties.miDataSource.getResponse.TotalLength;
        if(this.batchCount === 0)
        {
          this.isBatchSelected = false;
        }
      }
    });
  }
  // ###############################################################################################################################
  GetPayeeListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetPayeeList;
    this.PayeeListProperties.url = this.url
    this.PayeeListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.PayeeListProperties.displayedColumns = ['Checkbox', 'PayeeName'];
    this.PayeeListProperties.columnLabels = ['Checkbox', 'Payee'];
    this.PayeeListProperties.columnIsSortable = ['false', 'true'];
    this.PayeeListProperties.refreshHandler = this.needpayeelistRefresh;
    this.PayeeListProperties.resetPagingHandler = this.needPageReset;
    this.PayeeListProperties.miListMenu = new MiListMenu();
    this.PayeeListProperties.miListMenu.visibleOnDesk = true;
    this.PayeeListProperties.miListMenu.visibleOnMob = false;
    this.PayeeListProperties.showPaging = false;
    this.PayeeListProperties.pageSize = this.getRouterparamter.pageSize
    this.PayeeListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.PayeeListProperties.isEditablegrid = true;
    this.PayeeListProperties.isClientSideList = true;
    this.PayeeListProperties.clientSideSearch = this.searchList;
    this.PayeeListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    this.PayeeListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.isPayeeListfound = true;
        this.PayeeCount = this.PayeeListProperties.miDataSource.tableData.length;
      } else if (this.PayeeListProperties.miDataSource.pageLength >= 0) {
        this.isPayeeListfound = true;
      }
    });
    this.GetBatchesListing();
    this.GetBatchListPrmtrs();
    this.GetSegmentListing();
    this.GetSegmentListprmtrs()
  }
  // ###############################################################################################################################

  // ###############################################################################################################################
  GetSegmentListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetSegmentList;
    this.SegmentListProperties.url = this.url
    this.SegmentListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.SegmentListProperties.displayedColumns = ['Checkbox', 'SegmentName'];
    this.SegmentListProperties.columnLabels = ['Checkbox', 'Segments'];
    this.SegmentListProperties.columnIsSortable = ['false', 'true'];
    this.SegmentListProperties.refreshHandler = this.needpayeelistRefresh;
    this.SegmentListProperties.resetPagingHandler = this.needPageReset;
    this.SegmentListProperties.miListMenu = new MiListMenu();
    this.SegmentListProperties.miListMenu.visibleOnDesk = true;
    this.SegmentListProperties.miListMenu.visibleOnMob = false;
    this.SegmentListProperties.showPaging = false;
    this.SegmentListProperties.pageSize = this.getRouterparamter.pageSize
    this.SegmentListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.SegmentListProperties.isEditablegrid = true;
    this.SegmentListProperties.isClientSideList = true;
    this.SegmentListProperties.clientSideSearch = this.searchList;
    this.SegmentListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    this.SegmentListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.isSegmentListfound = true;
        this.SegmentCount = this.SegmentListProperties.miDataSource.tableData.length;
      } else if (this.SegmentListProperties.miDataSource.pageLength >= 0) {
        this.isSegmentListfound = true;
      }
    });
    // this.GetBatchesListing();
    // this.GetBatchListPrmtrs();
  }
  // ###############################################################################################################################


  GetReportNameListing() {
    //alert("in");
    //debugger;
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetReportNameListing;
    this.ReportNameProperties.url = this.url
    this.ReportNameProperties.miDataSource = new TableDataSource(this.reportManagersvc);

    //to comment if IsArison check is used
    //this.ReportNameProperties.displayedColumns = ['Checkbox', 'Name', 'Description'];
    //to comment if IsArison check is used

    //IsArison check of radiobutton to uncomment
    if(this.isArison === false)
    {
      this.ReportNameProperties.displayedColumns = ['Checkbox', 'Name', 'Description'];
    }
    else
    {
      this.ReportNameProperties.displayedColumns = ['Radiobutton', 'Name', 'Description'];
    }
    //IsArison check of radiobutton to uncomment

    //to comment if IsArison check is used
    //this.ReportNameProperties.columnLabels = ['Checkbox', 'Name', 'Details'];
    //to comment if IsArison check is used

    //IsArison check of radiobutton to uncomment
    if(this.isArison === false)
    {
      this.ReportNameProperties.columnLabels = ['Checkbox', 'Name', 'Details'];
    }
    else
    {
      this.ReportNameProperties.columnLabels = ['', 'Name', 'Details'];
    }
    //IsArison check of radiobutton to uncomment

    this.ReportNameProperties.columnIsSortable = ['false', 'true', 'true'];
    this.ReportNameProperties.refreshHandler = this.needReportNameRefresh;
    this.ReportNameProperties.resetPagingHandler = this.needPageReset;
    this.ReportNameProperties.miListMenu = new MiListMenu();
    this.ReportNameProperties.miListMenu.visibleOnDesk = true;
    this.ReportNameProperties.miListMenu.visibleOnMob = false;
    this.ReportNameProperties.showPaging = false;
    this.ReportNameProperties.isEditablegrid = true;
    this.ReportNameProperties.isClientSideList = true;
    this.ReportNameProperties.clientSideSearch = this.searchList;

    //to comment if IsArison check is used
    // this.ReportNameProperties.fieldType = {
    //   'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    // }
    //to comment if IsArison check is used

    //IsArison check of radiobutton to uncomment
    if(this.isArison === false)
    {
      //alert("in");
      this.ReportNameProperties.fieldType = {
        'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
      }
    }
    else
    {
      //alert("in1");
      this.ReportNameProperties.fieldType = {
        'Radiobutton': new MiListFieldType('', '', '', '', 'radio-button', '', '', false, null, '', '', ''),
      }
    }
    //IsArison check of radiobutton to uncomment

    this.ReportNameProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.ReportCount = this.ReportNameProperties.miDataSource.tableData.length;
      }
    });
    this.GetPayeeListing();
    this.GetPayeeListprmtrs();
  }
  // ###############################################################################################################################
  // -----------------------Select a checkbox functionality for batches,payee and Report table-------------------------------------------
  OnBatchListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.BatchDetailsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isBatchSelected = true;
      return;
    } else {
      this.isBatchSelected = false;
    }
  }
  // ###############################################################################################################################
  OnSegmentListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isSegmentSelected = true;
      return;
    } else {
      this.isSegmentSelected = false;
    }
  }
  // ###############################################################################################################################
  OnPayeeListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isPayeeSelected = true;
      return;
    } else {
      this.isPayeeSelected = false;
    }
  }
  OnReportNameRbtnClicked(value) {
     //alert("inaaaa");
    
    //  if(value.name === "radio-button")
    //  {
    //   value.data.Checked = false;
    //  }
    
     
     //alert("value.data.Checked="+value.data.Checked);
     //alert("value.data.Code="+value.data.Code);
     //alert("value.name="+value.name);
     
     if(value.name === "radio-button")
     {
       //alert("in2aaaa");
      value.data.Checked = !value.data.Checked;
     }
     
    //alert("value.data.Checked2="+value.data.Checked);

     ////this.IsAllCheckboxSlected();

     for (const ReportName of this.ReportNameProperties.miDataSource.tableData) {
      //alert("in1EA");
      //alert("ReportName.Checked="+ReportName.Checked);
      //alert("ReportName.Code="+ReportName.Code);
      if(ReportName.Code === value.data.Code)
      {
        //alert("inE");
        ReportName.Checked = true;
      }
      else
      {
        //alert("inE1");
        ReportName.Checked = false;
      }
    }

     if (value.data.Code === 'PS' && value.data.Checked === true) {
       //alert("in1");

       //this.isSubTotal.setValue(true);
       this.isBatchPaid = true;
       this.isSubTotal.enable();
     } else {
       //alert("in2");

       this.isBatchPaid = false;
       this.isSubTotal.setValue(false);
       this.isSubTotal.disable();
     }

     //alert("this.ReportNameProperties.miDataSource.tableData="+this.ReportNameProperties.miDataSource.tableData.length);
     //alert("j="+JSON.stringify(this.ReportNameProperties.miDataSource.tableData));
     if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
       x.Checked === true).length > 0) {
         //alert("in3");
       this.isReportSelected = true;
       return;
     } else {
       //alert("in4");
       this.isReportSelected = false;
     }
    //this.isReportSelected = true;
  }
  // ###############################################################################################################################
  OnReportNameChkBoxClicked(value) {
    //alert("in1");
    
    //alert("value.data.Checked="+value.data.Checked);
    
    value.data.Checked = !value.data.Checked
    
    //alert("value.data.Checked2="+value.data.Checked);
    
    this.IsAllCheckboxSlected();
    if (value.data.Code === 'PS' && value.data.Checked === true) {
      this.isSubTotal.enable();
    } else {
      this.isSubTotal.disable();
    }
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isReportSelected = true;
      return;
    } else {
      this.isReportSelected = false;
    }
  }
  // ####################################################################################################################################
  IsAllCheckboxSlected() {
    // tslint:disable-next-line:max-line-length
    //alert("in2");
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.ReportNameProperties.miDataSource.tableData.length) {
        //alert("in3");
      this.reportAllCheckBoxSelect = true;
    } else {
      //alert("in4");
      this.reportAllCheckBoxSelect = false;
    }
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayeeListProperties.miDataSource.tableData.length) {
      this.payeeAllCheckBoxSelect = true;
    } else {
      this.payeeAllCheckBoxSelect = false;
    }
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.SegmentListProperties.miDataSource.tableData.length) {
      this.segmentAllCheckBoxSelect = true;
    } else {
      this.segmentAllCheckBoxSelect = false;
    }
    if (this.BatchDetailsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.BatchDetailsListProperties.miDataSource.tableData.length) {
      this.batchAllCheckBoxSelect = true;
    } else {
      this.batchAllCheckBoxSelect = false;
    }
  }
  AfterReportDataLoading() {
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.ReportNameProperties.miDataSource.tableData.length) {
      this.reportAllCheckBoxSelect = true;
      this.isReportSelected = true;
    } else {
      this.reportAllCheckBoxSelect = false;
    }
  }
  // ###############################################################################################################################
  AfterBatchDataLoading() {
    if (this.BatchDetailsListProperties.miDataSource.tableData && this.BatchDetailsListProperties.miDataSource.tableData.length > 0) {
      if (this.BatchDetailsListProperties.miDataSource.tableData.filter(x =>
        x.Checked === true).length === this.BatchDetailsListProperties.miDataSource.tableData.length) {
        this.batchAllCheckBoxSelect = true;
        this.isBatchSelected = true;
      } else {
        this.batchAllCheckBoxSelect = false;
      }
    }
  }
  // ###############################################################################################################################
  AfterSegmentDataLoading() {
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.SegmentListProperties.miDataSource.tableData.length) {
      this.segmentAllCheckBoxSelect = true;
      this.isSegmentSelected = true;
    } else {
      this.segmentAllCheckBoxSelect = false;
    }
  }
  // ###############################################################################################################################
  AfterPayeeDataLoading() {
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayeeListProperties.miDataSource.tableData.length) {
      this.payeeAllCheckBoxSelect = true;
      this.isPayeeSelected = true;
    } else {
      this.payeeAllCheckBoxSelect = false;
    }
  }
  // ###############################################################################################################################
  // -------------------------------------- Select all functionality for check box -------------------------------------------------------
  OnbatchListSlctAllCheckBoxes(value) {
    this.BatchDetailsListProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.batchAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.batchAllCheckBoxSelect = !this.batchAllCheckBoxSelect;
    if (this.BatchDetailsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isBatchSelected = true;
      return;
    } else {
      this.isBatchSelected = false;
    }
  }
  // ###############################################################################################################################
  OnSegmentListSlctAllCheckBoxes(value) {
    this.SegmentListProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.segmentAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.segmentAllCheckBoxSelect = !this.segmentAllCheckBoxSelect;
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isSegmentSelected = true;
      return;
    } else {
      this.isSegmentSelected = false;
    }
  }
  // ###############################################################################################################################
  OnPayeeListSlctAllCheckBoxes(value) {
    this.PayeeListProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.payeeAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.payeeAllCheckBoxSelect = !this.payeeAllCheckBoxSelect;
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isPayeeSelected = true;
      return;
    } else {
      this.isPayeeSelected = false;
    }
  }
  // ###############################################################################################################################
  OnReportListSlctAllCheckBoxes(values) {
    this.ReportNameProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.reportAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
      if (element.Code === 'PS' && element.Checked === true) {
        this.isSubTotal.enable()
      } else if (element.Code === 'PS' && element.Checked === false) {
        this.isSubTotal.disable()
      }
    });
    this.reportAllCheckBoxSelect = !this.reportAllCheckBoxSelect;
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isReportSelected = true;
      return;
    } else {
      this.isReportSelected = false;
    }
  }
  // ######################################################################################################################################
  ReportNameListingPrmtrs() {
    this.postdata = {
      'reportGroupName': 'Payee'
    };
    this.ReportNameProperties.requestPostData = this.postdata;
    this.ReportNameProperties.refreshHandler.next(true);
  }
  // ###############################################################################################################################
  GetBatchListPrmtrs() {
    this.postdata = {
      'licenseeId': this.userdetails.LicenseeId,
      'filter': this.ListFilters.controls.mainFilter.value,
      'monthFilter': this.selectedMonth
    };
    // 
    this.BatchDetailsListProperties.requestPostData = this.postdata;
    this.BatchDetailsListProperties.refreshHandler.next(true);
  }
  // ###############################################################################################################################
  GetPayeeListprmtrs() {
    this.postdata = {
      'licenseeId': this.userdetails.LicenseeId
    };
    this.PayeeListProperties.requestPostData = this.postdata;
    this.PayeeListProperties.refreshHandler.next(true);
  }
  // ###############################################################################################################################
  // ###############################################################################################################################
  GetSegmentListprmtrs() {
    this.postdata = {
      'LicenseeId': this.userdetails.LicenseeId,
      'isBlankRequired': true
    };
    this.SegmentListProperties.requestPostData = this.postdata;
    this.SegmentListProperties.refreshHandler.next(true);
  }
  // ###############################################################################################################################
  GetReportListData() {
    let batches = '';
    let payees = '';
    let segments = '';
    let reportName = '';
    if (this.batchList && this.batchList.length > 0) {
      for (const batchData of this.BatchDetailsListProperties.miDataSource.tableData) {
        if (batchData.Checked === true) {
          batches += batchData.BatchId + ',';
        }
      }
      this.batches = batches;
      const batchList = this.batches.substring(0, this.batches.length - 1);
      if (batchList) {
        const batchCount = batchList.split(',').length;
        if (batchCount === this.BatchDetailsListProperties.miDataSource.tableData.length
          && this.ListFilters.controls.mainFilter.value == 'All') {
          this.batches = this.batches + 'All';
        }
      }
    }

    if (this.SegmentListProperties.miDataSource.tableData && this.SegmentListProperties.miDataSource.tableData.length > 0) {
      for (const segmentData of this.SegmentListProperties.miDataSource.tableData) {
        if (segmentData.Checked === true) {
          segments += segmentData.SegmentId + ',';
        }
      }
      this.segments = segments.substring(0, segments.length - 1);
      if (this.segments) {
        const SegmentCount = this.segments.split(',').length;
        if (SegmentCount === this.SegmentListProperties.miDataSource.tableData.length) {
          this.segments = this.segments + ',' + 'All'
        }
        else if (SegmentCount === 1) {
          let id = this.segments.replace(',', '');
          this.segments = (id === Guid.createEmpty().toJSON().value) ? this.segments + ',' + 'OnlyBlank' : this.segments + ',' + 'OnlyIDs';
        }
	    else if (SegmentCount >= 2 && this.segments.includes('00000000-0000-0000-0000-000000000000')) {
          this.segments = this.segments + ',' + 'Both'
        }
        else {
          // var segArr = [];
          // var emptyCount = 0;
          // //alert("segArr="+segArr);
          // segArr = this.segments.split(',');
          // //alert("segArr1="+segArr);
          // segArr.some(function(value, index, _aryFunc) {
             // //alert(index + ": " + value);
          // //   //return value.indexOf("Script") > -1;
            // if(value === "00000000-0000-0000-0000-000000000000")
            // {
              // emptyCount = 1;
            // }
          // });
          // if(emptyCount === 1)
          // {
            // this.segments = this.segments + ',' + 'All';
          // }
          // else
          // {
            // this.segments = this.segments + ',' + 'OnlyIDs';
          // }

          this.segments = this.segments + ',' + 'OnlyIDs';
        }
      }
    }

    if (this.PayeeListProperties.miDataSource.tableData && this.PayeeListProperties.miDataSource.tableData.length > 0) {
      for (const payeeData of this.PayeeListProperties.miDataSource.tableData) {
        if (payeeData.Checked === true) {
          payees += payeeData.UserCredentialId + ',';
        }
      }
      this.payees = payees.substring(0, payees.length - 1);
      if (this.payees) {
        const PayeeCount = this.payees.split(',').length;
        if (PayeeCount === this.PayeeListProperties.miDataSource.tableData.length) {
          this.payees = this.payees + ',' + 'All'
        }
      }
    }
    if (this.ReportNameProperties.miDataSource.tableData && this.ReportNameProperties.miDataSource.tableData.length > 0) {
      //alert("inA");
      for (const ReportName of this.ReportNameProperties.miDataSource.tableData) {
        //alert("in1A");
        //alert("ReportName.Checked="+ReportName.Checked);
        //alert("ReportName.Code="+ReportName.Code);
        if (ReportName.Checked === true) {
          //alert("in2A");
          reportName += ReportName.Code + ',';
        }
      }
      this.reportName = reportName; // reportName.substring(0, reportName.length - 1);
      const reports = this.reportName.substring(0, reportName.length - 1)
      if (reports) {
        const reportCount = reports.split(',').length;
        if (reportCount === this.ReportNameProperties.miDataSource.tableData.length) {
          this.reportName = this.reportName + 'All'
        }
      }
    }
  }
  // ###############################################################################################################################
  PrintReport(format) {
    this.showLoader = true;//ask to use to not

    this.SaveReport(format);

    /*if (this.isArison) 
    {
      //alert("in");
    this.openEmailDialog(format);
    } 
    else 
    {
      //alert("in1A");
      this.showLoader = true;
      this.SaveReport(format);
    }*/
  }
  // ###############################################################################################################################
  SetBatchMarkAsPaid() {
    const dilogref = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Mark Paid',
        subTitle: 'Are you sure you want to mark batches as paid?',
        isCommanFunction: true,
        numberofButtons: '2',
        primarybuttonName: 'Yes, Mark Paid',
        secondryButtonName: 'No'
      },
      width: '450px',
      disableClose: true,
    });
    dilogref.afterClosed().subscribe(result => {
      if (result === true) {
        this.showLoader = true;
        let BatchIdList = this.batches.substring(0, this.batches.length - 1);
        BatchIdList = BatchIdList.split(',');
        this.postdata = {
          'batchIds': this.batches,
          'lstPayee': this.payees,
          'strFilter': this.StatusFilter.controls.statusFilterType.value,
          'lstSegments': this.segments
        };
        this.reportManagersvc.SetBatchMarkedPaid(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            if (response.StringValue === '') {
              const totalcount = BatchIdList.length;
              const failedBatchCount = 0;
              const successCount = totalcount - failedBatchCount;
              const batches = [];
              this.BatchStatusDilogBox(totalcount, failedBatchCount, successCount, batches)
            } else {
              let failedBatches = response.StringValue;
              failedBatches = failedBatches.substring(0, failedBatches.length - 1);
              const batches = failedBatches.split(',')
              const totalcount = BatchIdList.length;
              const failedBatchCount = failedBatches.split(',').length;
              const successCount = totalcount - failedBatchCount;
              this.BatchStatusDilogBox(totalcount, failedBatchCount, successCount, batches)
            }
          }
          else {
            this.error.OpenResponseErrorDilog('Error occur while marked paid.');
            this.showLoader = false;
          }
        });
      }
    });
  }

  openEmailDialog(format) {
    const dialogRef = this.dialog.open(EmailDialogComponent,
      {
        width: '550px',
        disableClose: true,
      });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        //alert("in2");
        //this.showLoader = false;
        //this.isMRECRReportSlct = false;//ask to use or not
      } else {
        //alert("in3");
        this.EmailIds = result;
        this.SaveReport(format);
      }
    }
    );
  }

  SaveReport(format) {
    //alert("in1");
    //alert("this.batches="+this.batches);
	
    this.GetReportListData();
    //alert("this.segments="+this.segments);
    this.postdata = {
      'report': {
        'BatcheIds': this.batches,
        'LicenseeId': this.userdetails.LicenseeId,
        'AgentIds': this.payees,
        'SegmentIds': this.segments,
        'ReportNames': this.reportName,
        'ReportId': Guid.create().toJSON().value,
        'IsZero': this.isZero.value,
        'PaymentType': this.StatusFilter.controls.statusFilterType.value,
        'ReportType': format,
        'IsSubTotal': this.isSubTotal.value,
        'Email': this.EmailIds,
      },
      'userCredentialId': this.userdetails.UserCredentialID
    };
    const url = this.reportManagerURLSvc.payeeStatementReport.SavePayeeStatementReport;

    this.reportManagersvc.SaveReportDetails(this.postdata, url).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoader = false;
        const reportsName = this.reportName.split(',');

        let ispayeeStatementslct = false
        reportsName.filter(elementData => {
          if (elementData === 'PS') {
            ispayeeStatementslct = true;
          }
        });

        const element = response.ReportObject;
        const anchor = document.createElement('a');
        let fileExt = '';
        if (element.FileName) {
          fileExt = element.FileName.slice((element.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
        }
        if (fileExt) {
          
          if (ispayeeStatementslct) {
            this.SetBatchMarkAsPaid();
          }
          
		        anchor.href = ServerURLS.ReportURL + element.FileName;
		        //anchor.href = "../../../assets/" + element.FileName;
          if (fileExt.toLowerCase() === 'pdf') {
			  //alert("in");
			  //alert("ServerURLS.ReportURL_PDF="+ServerURLS.ReportURL_PDF);
            //anchor.href = ServerURLS.ReportURL_PDF + element.FileName;
            anchor.target = '_blank';
            anchor.download = element.FileName;
          }
		  // else{
			  // //alert("in1");
			  // //alert("ServerURLS.ReportURL_XLS="+ServerURLS.ReportURL_XLS);
			  // //anchor.href = ServerURLS.ReportURL_XLS + element.FileName;
		  // }
         
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }
      }
      else {
        this.error.OpenResponseErrorDilog(response.Message);
        this.showLoader = false;
      }
    })
  }

  // ###############################################################################################################################
  BatchStatusDilogBox(totalcount, failedBatchCount, successCount, failedbatches) {
    const dilogref = this.dialog.open(MarkedPaidBatchListComponent, {
      data: {
        totalcount: totalcount,
        failedBatchCount: failedBatchCount,
        successCount: successCount,
        failedbatches: failedbatches,
        headingTitle: 'Batch Status',
        subTitle: 'Status of the selected batches'
      },
      width: '650px',
      disableClose: true,
    });
    dilogref.afterClosed().subscribe(result => {
      this.batchList = '';
      this.showLoader = false;
      this.GetBatchesListing();
      this.GetBatchListPrmtrs();
      this.BatchDetailsListProperties.refreshHandler.next(true);
      this.batchAllCheckBoxSelect = true;
    });
  }
  // ###############################################################################################################################
  OnChangeMainFilter(selectedRecord) {
    this.BatchDetailsListProperties.resetPagingHandler.next(true);
    this.isYearChange.next(false);
    this.isMonthShown = !isNaN(selectedRecord.value) ? true : false;
    if (this.isMonthShown) {
      this.selectedMonth = this.calenderSvc.GetMonthList();
      this.selectedMonth = this.selectedMonth.map(item => { return item.key });
      this.selectedMonth = this.OnSetAllSelectedMonths(this.selectedMonth);
    }
    else {
      this.selectedMonth = "";
    }
    this.GetBatchListPrmtrs();
  }
  OnSetAllSelectedMonths(list) {
    let data = "";
    list.filter(item => {
      data = data == "" ? item : data + ',' + item;
    });
    return data;
  }
  // ###############################################################################################################################
  OnFilterBatchListMonthly(selectedValues) {
    this.selectedMonth = this.OnSetAllSelectedMonths(selectedValues.Month);

    this.GetBatchListPrmtrs();
    // let arr = [];
    // this.monthsFilters.filter(element => {
    //   if (selectedValues.Month.includes(element.Month)) {
    //     arr.push(element.MonthName);
    //   }
    // });
    // if (arr.length == 12) {
    //   this.GetBatchListPrmtrs();
    //   this.BatchDetailsListProperties.refreshHandler.next(true);
    // } else {
    //   let listForSearching = [];
    //   listForSearching = Object.assign([], this.batchList);
    //   const newList = [];
    //   const sortingColumn = 'CreatedDateString';
    //   arr.filter(item => {
    //     listForSearching.filter(element => {
    //       if (element[sortingColumn].includes(item) && element[sortingColumn].includes(this.ListFilters.controls.mainFilter.value)) {
    //         newList.push(element);
    //       }
    //     });
    //   });
    //   this.batchCount = newList.length;
    //   this.BatchDetailsListProperties.cachedList = newList.sort(this.sortFunction);
    //   this.BatchDetailsListProperties.refreshHandler.next(true);
    // }
  }

  // ###############################################################################################################################
  sortFunction(firstDate, seconddate) {
    const dateA = new Date(firstDate.CreatedDateString).setHours(0, 0, 0, 0);
    const dateB = new Date(seconddate.CreatedDateString).setHours(0, 0, 0, 0);
    return dateA > dateB ? -1 : 1;
  };
  // ###############################################################################################################################
}
