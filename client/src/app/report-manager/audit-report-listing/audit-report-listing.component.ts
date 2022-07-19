import { Component, OnInit } from '@angular/core';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from '../../_services/table.datasource';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { ResponseCode } from 'src/app/response.code';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ReportManagerService } from '../report-manager.service';
import { ReportManagerURLService } from '../report-manager-url.service';
import { CONSTANTS, ServerURLS } from '../../../assets/config/CONSTANTS';
import { Guid } from 'guid-typescript';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { EmailDialogComponent } from 'src/app/_services/dialogboxes/email-dialog/email-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-audit-report-listing',
  templateUrl: './audit-report-listing.component.html',
  styleUrls: ['./audit-report-listing.component.scss']
})
export class AuditReportListingComponent implements OnInit {


  //isArison: boolean = JSON.parse(localStorage.getItem('loggedUser')).LicenseeId == CONSTANTS.arisonId;
  title: any;
  PayorsListProperties: MiProperties = new MiProperties();
  PayeeListProperties: MiProperties = new MiProperties();
  SegmentListProperties: MiProperties = new MiProperties();
  ReportNameProperties: MiProperties = new MiProperties();
  needPayorlistRefresh: Subject<boolean> = new Subject();
  needpayeelistRefresh: Subject<boolean> = new Subject();
  needReportNameRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  url: any;
  EmailIds: any;
  userdetails: any;
  payor: any;
  payees: any;
  segments: any;
  reportName: any;
  isValidationShown: Boolean = false;
  postdata: any;
  invoiceFromDate: any;
  invoiceToDate: any;
  showLoader = false;
  // ---------------------Count Initalization-------------------
  PayorCount: any = 0;
  ReportCount: any = 0;
  PayeeCount: any = 0;
  SegmentCount: any = 0;
  // ##############################################################
  // -----------------Select all functionality Variables  used-------------------
  PayorAllCheckBoxSelect = false;
  payeeAllCheckBoxSelect = false;
  segmentAllCheckBoxSelect = false;
  reportAllCheckBoxSelect = false

  // #############################################################################

  isPayorListfound: Boolean = false;
  isPayeeListfound: Boolean = false;
  isSegmentListfound: Boolean = false;
  isReportListfound: Boolean = false;
  // #############################################################################

  isPayorSelected: Boolean = false;
  isPayeeSelected: Boolean = false;
  isSegmentSelected: Boolean = false;
  isReportSelected: Boolean = false;
  isFollowUpSlctd: Boolean = false;
  // ##############################################################################
  Type = new FormControl(4, []);
  OrderBy = new FormControl('Client', []);
  FromDate = new FormControl('', []);
  ToDate = new FormControl('', []);
  todaydate: any;
  typeFilters = [
    {
      key: 4, value: 'All'
    },
    {
      key: 3, value: 'Both'
    },
    {
      key: 1, value: 'Missing',
    },
    {
      key: 2, value: 'Resolved Only',
    }

  ];
  orderByFilters = [
    {
      key: 1, value: 'Client',
    },
    {
      key: 2, value: 'Carrier',
    },
    {
      key: 3, value: 'Payor',
    },
    {
      key: 3, value: 'Product'
    }
  ];
  constructor(
    public getRouterparamter: GetRouteParamtersService,
    public reportManagersvc: ReportManagerService,
    public reportManagerURLSvc: ReportManagerURLService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.title = 'Report Manager';
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayorListing();
    this.GetPayorListPrmtrs();
  }
  GetPayorListing() {
    this.url = this.reportManagerURLSvc.AuditReport.GetPayorList;
    this.PayorsListProperties.url = this.url
    this.PayorsListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.PayorsListProperties.displayedColumns = ['Checkbox', 'PayorName'];
    this.PayorsListProperties.columnLabels = ['Checkbox', 'Payors'];
    this.PayorsListProperties.columnIsSortable = ['false', 'true'];
    this.PayorsListProperties.refreshHandler = this.needPayorlistRefresh;
    this.PayorsListProperties.resetPagingHandler = this.needPageReset;
    this.PayorsListProperties.miListMenu = new MiListMenu();
    this.PayorsListProperties.miListMenu.visibleOnDesk = true;
    this.PayorsListProperties.miListMenu.visibleOnMob = false;
    this.PayorsListProperties.showPaging = false;
    this.PayorsListProperties.pageSize = this.getRouterparamter.pageSize
    this.PayorsListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.PayorsListProperties.isEditablegrid = true;
    this.PayorsListProperties.isClientSideList = true;
    this.PayorsListProperties.clientSideSearch = this.searchList;
    this.PayorsListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    this.PayorsListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.isPayorListfound = true;
        this.PayorCount = this.PayorsListProperties.miDataSource.tableData.length;
      } else if (this.PayorsListProperties.miDataSource.pageLength >= 0) {
        this.isPayorListfound = true;
        this.PayorCount = this.PayorsListProperties.miDataSource.tableData.length;
      }
    });
    this.GetPayeeListing();
    this.GetPayeeListprmtrs();
  }

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
        this.SegmentCount = this.SegmentListProperties.miDataSource.tableData.length;
      }
    });
    // this.GetReportNameListing();
    // this.ReportNameListingPrmtrs();
  }

  GetPayeeListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetPayeeList;
    this.PayeeListProperties.url = this.url
    this.PayeeListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.PayeeListProperties.displayedColumns = ['Checkbox', 'PayeeName'];
    this.PayeeListProperties.columnLabels = ['Checkbox', 'Brokers'];
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
        this.PayorCount = this.PayorsListProperties.miDataSource.tableData.length;
      }

    });
    this.GetReportNameListing();
    this.ReportNameListingPrmtrs();
    this.GetSegmentListing();
    this.GetSegmentListprmtrs();
  }
   // ###############################################################################################################################
   GetSegmentListprmtrs() {
    this.postdata = {
      'LicenseeId': this.userdetails.LicenseeId,
      'isBlankRequired': true,
      'isBlankRequiredIfEmpty': true,
    };
    this.SegmentListProperties.requestPostData = this.postdata;
    this.SegmentListProperties.refreshHandler.next(true);
  }
  // ###############################################################################################################################
  GetReportNameListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetReportNameListing;
    this.ReportNameProperties.url = this.url
    this.ReportNameProperties.miDataSource = new TableDataSource(this.reportManagersvc);

    //to comment if IsArison check is used
    this.ReportNameProperties.displayedColumns = ['Checkbox', 'Name', 'Description'];
    //to comment if IsArison check is used

    //IsArison check of radiobutton to uncomment
    // if(this.isArison === false)
    // {
    //   this.ReportNameProperties.displayedColumns = ['Checkbox', 'Name', 'Description'];
    // }
    // else
    // {
    //   this.ReportNameProperties.displayedColumns = ['Radiobutton', 'Name', 'Description'];
    // }
    //IsArison check of radiobutton to uncomment

    //to comment if IsArison check is used
    this.ReportNameProperties.columnLabels = ['Checkbox', 'Name', 'Details'];
    //to comment if IsArison check is used

    //IsArison check of radiobutton to uncomment
    // if(this.isArison === false)
    // {
    //   this.ReportNameProperties.columnLabels = ['Checkbox', 'Name', 'Details'];
    // }
    // else
    // {
    //   this.ReportNameProperties.columnLabels = ['', 'Name', 'Details'];
    // }
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
    this.ReportNameProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    //to comment if IsArison check is used

    //IsArison check of radiobutton to uncomment
    // if(this.isArison === false)
    // {
    //   this.ReportNameProperties.fieldType = {
    //     'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    //   }
    // }
    // else
    // {
    //   //alert("in1");
    //   this.ReportNameProperties.fieldType = {
    //     'Radiobutton': new MiListFieldType('', '', '', '', 'radio-button', '', '', false, null, '', '', ''),
    //   }
    // }
    //IsArison check of radiobutton to uncomment

    this.ReportNameProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.ReportCount = this.ReportNameProperties.miDataSource.tableData.length;
        this.isReportListfound = true;
      } else if (this.ReportNameProperties.miDataSource.pageLength >= 0) {
        this.isReportListfound = true;
        this.ReportCount = this.ReportNameProperties.miDataSource.tableData.length;
      }
    });
  }
  // -----------------------Select a checkbox functionality for batches,payee and Report table-------------------------------------------
  OnPayorListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.PayorsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isPayorSelected = true;
      return;
    } else {
      this.isPayorSelected = false;
    }
  }
  OnPayeeListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isPayeeSelected = true;
      return;
    }
    else
    {
      this.isPayeeSelected = false;
    }
  }
  OnSegmentListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isSegmentSelected = true;
      return;
    }
    else
    {
      this.isSegmentSelected = false;
    }
  }
  OnReportNameRbtnClicked(value) {
   
    if(value.name === "radio-button")
    {
      value.data.Checked = !value.data.Checked
    }
    //this.IsAllCheckboxSlected();

    for (const ReportName of this.ReportNameProperties.miDataSource.tableData) {
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

    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
     
      for (const item of this.ReportNameProperties.miDataSource.tableData) {
        if ((item.Code === 'AUFU') && item.Checked === true) {
          this.isFollowUpSlctd = true;
          break;
        } else {
          this.isFollowUpSlctd = false;
        }
      }
      this.isReportSelected = true;
      return;
    } else {
      this.isReportSelected = false;
    }
  }

  OnReportNameChkBoxClicked(value) {
   
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
     
      for (const item of this.ReportNameProperties.miDataSource.tableData) {
        if ((item.Code === 'AUFU') && item.Checked === true) {
          this.isFollowUpSlctd = true;
          break;
        } else {
          this.isFollowUpSlctd = false;
        }
      }
      this.isReportSelected = true;
      return;
    } else {
      this.isReportSelected = false;
    }
  }

  // ####################################################################################################################################
  IsAllCheckboxSlected() {
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.ReportNameProperties.miDataSource.tableData.length) {
      this.reportAllCheckBoxSelect = true;
    } else {
      this.reportAllCheckBoxSelect = false;
    }
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.SegmentListProperties.miDataSource.tableData.length) {
      this.segmentAllCheckBoxSelect = true;
    } else {
      this.segmentAllCheckBoxSelect = false;
    }
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayeeListProperties.miDataSource.tableData.length) {
      this.payeeAllCheckBoxSelect = true;
    } else {
      this.payeeAllCheckBoxSelect = false;
    }
    if (this.PayorsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayorsListProperties.miDataSource.tableData.length) {
      this.PayorAllCheckBoxSelect = true;
    } else {
      this.PayorAllCheckBoxSelect = false;
    }
  }
  // -------------------------------------- Select all functionality for check box -------------------------------------------------------
  OnPayorListSlctAllCheckBoxes(value) {
    this.PayorsListProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.PayorAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.PayorAllCheckBoxSelect = !this.PayorAllCheckBoxSelect;
    if (this.PayorsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isPayorSelected = true;
      return;
    } else {
      this.isPayorSelected = false;
    }
  }
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
  OnReportListSlctAllCheckBoxes(values) {
    this.ReportNameProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.reportAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.reportAllCheckBoxSelect = !this.reportAllCheckBoxSelect;
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isReportSelected = true;
      this.isFollowUpSlctd = true;
      return;
    } else {
      this.isReportSelected = false;
      this.isFollowUpSlctd = false;
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
  AfterPayorDataLoading() {
    if (this.PayorsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayorsListProperties.miDataSource.tableData.length) {
      this.PayorAllCheckBoxSelect = true;
      this.isPayorSelected = true;
    } else {
      this.PayorAllCheckBoxSelect = false;
    }
  }
  AfterPayeeDataLoading() {
    if (this.PayeeListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayeeListProperties.miDataSource.tableData.length) {
      this.payeeAllCheckBoxSelect = true;
      this.isPayeeSelected = true;
    } else {
      this.payeeAllCheckBoxSelect = false;
    }
  }
  AfterSegmentDataLoading() {
    if (this.SegmentListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.SegmentListProperties.miDataSource.tableData.length) {
      this.segmentAllCheckBoxSelect = true;
      this.isSegmentSelected = true;
    } else {
      this.segmentAllCheckBoxSelect = false;
    }
  }
  // ######################################################################################################################################
  ReportNameListingPrmtrs() {
    this.postdata = {
      'reportGroupName': 'Audit'
    };
    this.ReportNameProperties.requestPostData = this.postdata;
    this.ReportNameProperties.refreshHandler.next(true);
  }
  GetPayorListPrmtrs() {
    this.postdata = {
      'LicenseeID': this.userdetails.LicenseeId
    };
    this.PayorsListProperties.requestPostData = this.postdata;
    this.PayorsListProperties.refreshHandler.next(true);
  }
  GetPayeeListprmtrs() {
    this.postdata = {
      'licenseeId': this.userdetails.LicenseeId
    };
    this.PayeeListProperties.requestPostData = this.postdata;
    this.PayeeListProperties.refreshHandler.next(true);
  }

  GetReportListData(format) {
    let payors = '';
    let payees = '';
    let segments = '';
    let reportName = '';
    if (this.PayorsListProperties.miDataSource.tableData && this.PayorsListProperties.miDataSource.tableData.length > 0) {
      for (const payorData of this.PayorsListProperties.miDataSource.tableData) {
        if (payorData.Checked === true) {
          payors += payorData.PayorID + ',';
        }
      }
      this.payor = payors;
      const payorList = this.payor.substring(0, this.payor.length - 1);
      if (payorList) {
        const payorCount = payorList.split(',').length;
        if (payorCount === this.PayorsListProperties.miDataSource.tableData.length) {
          this.payor = this.payor + 'All';
        }
      }
    }
    if (this.PayeeListProperties.miDataSource.tableData && this.PayeeListProperties.miDataSource.tableData.length > 0) {
      for (const payeeData of this.PayeeListProperties.miDataSource.tableData) {
        if (payeeData.Checked === true) {
          payees += payeeData.UserCredentialId + ',';
        }
      }
      this.payees = payees;
      const payeeList = this.payees.substring(0, payees.length - 1);
      if (payeeList) {
        const payeeCount = payeeList.split(',').length;
        if (payeeCount === this.PayeeListProperties.miDataSource.tableData.length) {
          this.payees = this.payees + 'All';
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
      //const segmentList = this.segments.substring(0, segments.length - 1);
      if (this.segments) {
        const segmentCount = this.segments.split(',').length;
        if (segmentCount === this.SegmentListProperties.miDataSource.tableData.length) {
          this.segments = this.segments + ',' +'All';
        }
        else if (segmentCount === 1) {
          let id = this.segments.replace(',', '');
          //alert("id="+id);
          //alert("Guid.createEmpty().toJSON().value="+Guid.createEmpty().toJSON().value);
          this.segments = (id === Guid.createEmpty().toJSON().value) ? this.segments + ',' + 'OnlyBlank' : this.segments + ',' + 'OnlyIDs';
        }
        else {
          var segArr = [];
          var emptyCount = 0;
          //alert("segArr="+segArr);
          segArr = this.segments.split(',');
          //alert("segArr1="+segArr);
          segArr.some(function(value, index, _aryFunc) {
             //alert(index + ": " + value);
          //   //return value.indexOf("Script") > -1;
            if(value === "00000000-0000-0000-0000-000000000000")
            {
              emptyCount = 1;
            }
          });
          if(emptyCount === 1)
          {
            this.segments = this.segments + ',' + 'All';
          }
          else
          {
            this.segments = this.segments + ',' + 'OnlyIDs';
          }

          //this.segments = this.segments + ',' + 'OnlyIDs';
        }
      }
    }

    if (this.ReportNameProperties.miDataSource.tableData && this.ReportNameProperties.miDataSource.tableData.length > 0) {
      for (const ReportName of this.ReportNameProperties.miDataSource.tableData) {
        if (ReportName.Checked === true) {
          if (format === 'Excel' &&  ReportName.Code !== 'AUNP') {
            reportName += ReportName.Code + '_EX' + ',';
          } else {
            reportName += ReportName.Code + ',';
          }
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
  PrintReport(format) {
    // 
    this.CalculateInvoiceFromDate();
    this.calculateInvoiceToDate();

    if (!this.ToDate.valid) {
      // 
      this.isValidationShown = true;
      return;
    }

    // if (this.isArison) 
    // {
    //   //alert("in");
    //   this.openEmailDialog(format);
    // } 
    // else 
    // {
      //alert("in1A");
      this.showLoader = true;
      this.SaveReport(format);
   // }
  }

  SaveReport(format) {
    this.GetReportListData(format);
    //alert("this.segments="+this.segments);
    this.postdata = {
      'report':
      {
        'PayorIds': this.payor,
        'LicenseeId': this.userdetails.LicenseeId,
        'AgentIds': this.payees,
        'SegmentIds': this.segments,
        'ReportNames': this.reportName,
        'ReportId': Guid.create().toJSON().value,
        'OrderBy': this.OrderBy.value,
        'FilterBy': this.Type.value,
        'FromInvoiceDateString': this.invoiceFromDate,
        'ToInvoiceDateString': this.invoiceToDate,
        'ReportType': format,
        'Email': this.EmailIds
      },
      'userCredentialId': this.userdetails.UserCredentialID
    };
    this.showLoader = true;

    //if(this.isArison === false) {
      //alert("in2");//
     // this.showLoader = true;
    //}
    /*else
    {
      alert("in2A");
    }*/

    const url = this.reportManagerURLSvc.AuditReport.SaveAuditReport;
   
    this.reportManagersvc.SaveReportDetails(this.postdata, url).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoader = false;
        const element = response.ReportObject;
        const anchor = document.createElement('a');
        const fileExt = element.FileName.slice((element.FileName.lastIndexOf(".") - 1 >>> 0) + 2);
        if (fileExt) {
         
		          anchor.href = ServerURLS.ReportURL + element.FileName;
		          //anchor.href = "../../../assets/" + element.FileName;
		  
          if (fileExt.toLowerCase() === 'pdf') {
            //anchor.href = ServerURLS.ReportURL_PDF + element.FileName;
            anchor.target = '_blank';
            anchor.download = element.FileName;
          }
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
        }
      }
    })
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
      } else {
        //alert("in3");
        this.EmailIds = result;
        this.SaveReport(format);
      }
    }
    );
  }

  CalculateInvoiceFromDate() {
    // 
    if (this.FromDate.value) {
      this.invoiceFromDate = this.FirstDayOfMonthFromDateTime(new Date(this.FromDate.value));
    } else if (!this.FromDate.value && !this.ToDate.value) {
      // 
      let todayDate;
      todayDate = new Date()
      todayDate.setDate(todayDate.getDate() - 63);
      todayDate.setMonth(todayDate.getMonth() - 1);
      todayDate = this.LastDayOfMonthFromDateTime(new Date(todayDate));
      todayDate.setFullYear(todayDate.getFullYear() - 1);
      todayDate.setDate(todayDate.getDate() + 1);
      this.invoiceFromDate = todayDate;
    } else if (!this.FromDate.value && this.ToDate.value) {
      // 
      let toDate;
      toDate = new Date(this.ToDate.value);
      toDate = this.LastDayOfMonthFromDateTime(new Date(toDate));
      toDate.setDate(toDate.getDate() + 1);
      toDate.setFullYear(toDate.getFullYear() - 1);
      this.invoiceFromDate = this.FirstDayOfMonthFromDateTime(new Date(toDate));
    }
    this.invoiceFromDate = this.setDateFormat(new Date(this.invoiceFromDate));
  }
  setDateFormat = (dateObj: Date): string => {
    // 
    if (dateObj) {
      // 
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()) || '');
    }
  }
  calculateInvoiceToDate() {
    if (this.ToDate.value) {
      this.invoiceToDate = this.LastDayOfMonthFromDateTime(new Date(this.ToDate.value));
    } else if (!this.FromDate.value && !this.ToDate.value) {
      let todayDate;
      todayDate = new Date()
      todayDate.setDate(todayDate.getDate() - 63);
      todayDate.setMonth(todayDate.getMonth() - 1);
      todayDate = this.LastDayOfMonthFromDateTime(new Date(todayDate));
      this.invoiceToDate = todayDate;
    } else if (this.FromDate.value && !this.ToDate.value) {
      let toDate;
      toDate = new Date(this.FromDate.value);
      toDate = this.FirstDayOfMonthFromDateTime(new Date(toDate));
      toDate = new Date(toDate);
      toDate.setFullYear(toDate.getFullYear() + 1);
      toDate.setDate(toDate.getDate() - 1);
      this.invoiceToDate = this.LastDayOfMonthFromDateTime(new Date(toDate));
    }
    this.invoiceToDate = this.setDateFormat(new Date(this.invoiceToDate));
  }
  FirstDayOfMonthFromDateTime(dateObj: Date) {
    if (dateObj) {
      let firstDate;
      firstDate = ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + 1 || ''));
      return firstDate;
    }
  }
  LastDayOfMonthFromDateTime(dateObj: Date) {
    if (dateObj) {
      let lastDate;
      lastDate = ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + 1 || ''));
      lastDate = new Date(lastDate);
      lastDate.setMonth(lastDate.getMonth() + 1);
      lastDate.setDate(lastDate.getDate() - 1);
      return lastDate;
    }
  }
  IsValidDateRange() {
    // 
    this.isValidationShown = false;
    if (this.FromDate.value && this.ToDate.value) {
      // 
      this.isValidationShown =
        new Date(this.FromDate.value).setHours(0, 0, 0, 0) > new Date(this.ToDate.value).setHours(0, 0, 0, 0);
      // !this.ToDate.valid;
    }

    /*
    if (!this.ToDate.valid) {
      this.isValidationShown = true;
    }
    else{
      this.isValidationShown = false;
    }*/
  }

  //   Email Dialog Box 



}
