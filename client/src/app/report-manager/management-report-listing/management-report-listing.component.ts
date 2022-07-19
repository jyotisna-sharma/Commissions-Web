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
import { ServerURLS } from '../../../assets/config/CONSTANTS';
import { Guid } from 'guid-typescript';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ManagementFilters } from './management-report-filters';
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponent } from '../../_services/dialogboxes/email-dialog/email-dialog.component';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-management-report-listing',
  templateUrl: './management-report-listing.component.html',
  styleUrls: ['./management-report-listing.component.scss'],
  providers: [ManagementFilters]
})
export class ManagementReportListingComponent implements OnInit {

  //isArison: boolean = JSON.parse(localStorage.getItem('loggedUser')).LicenseeId == CONSTANTS.arisonId;
  title: any;
  isMRECRReportSlct: Boolean = false;
  PayorsListProperties: MiProperties = new MiProperties();
  PayeeListProperties: MiProperties = new MiProperties();
  SegmentListProperties: MiProperties = new MiProperties();
  ReportNameProperties: MiProperties = new MiProperties();
  CarrierListProperties: MiProperties = new MiProperties();
  ProductListProperties: MiProperties = new MiProperties();
  needPayorlistRefresh: Subject<boolean> = new Subject();
  needCarrierlistRefresh: Subject<boolean> = new Subject();
  needPayeelistRefresh: Subject<boolean> = new Subject();
  needReportNameRefresh: Subject<boolean> = new Subject();
  needProductRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  url: any;
  userdetails: any;
  isValidationShown: Boolean = false;
  postdata: any;
  invoiceFromDate: any;
  invoiceToDate: any;
  showLoader = false;
  EmailIds: any;
  toolTipMessage: any;

  // -------------------------used for sending a data to api------------------------
  payor: any;
  payees: any;
  segments: any;
  reportName: any;
  checkedCarriers: any;
  checkProductList: any;
  // ################################################################################
  // ---------------------Count Initalization-------------------
  PayorCount: any = 0;
  ReportCount: any = 0;
  PayeeCount: any = 0;
  SegmentCount: any = 0;
  carrierCount: any = 0;
  productCount: any = 0;
  // ##############################################################
  // -----------------Select all functionality Variables  used-------------------
  PayorAllCheckBoxSelect = false;
  payeeAllCheckBoxSelect = false;
  segmentAllCheckBoxSelect = false;
  reportAllCheckBoxSelect = false;
  carriersAllCheckBoxSelect = false;
  productAllCheckBoxSelect = false;
  // #############################################################################
  isPayorSelected: Boolean = false;
  isPayeeSelected: Boolean = false;
  isSegmentSelected: Boolean = false;
  isReportSelected: Boolean = false;
  isCarrierSelected: Boolean = false;
  isProductSelected: Boolean = false;
  isEcrReportSelected: Boolean = false;
  isformValid: Boolean = true;
  // #############################################################################
  isPayorListfound: Boolean = false;
  isPayeeListfound: Boolean = false;
  isSegmentListfound: Boolean = false;
  isReportListfound: Boolean = false;
  isCarrierListfound: Boolean = false;
  isProductListfound: Boolean = false;
  // ##################################################################################
  todaydate: any;
  filterText: any;
  sortChange: any;
  isvalidationshown: Boolean = false;
  ValidationMessage: any;
  validationShownList: any = [];
  reportFilters: any = new FormGroup({
    Type: new FormControl('Active/Pending', {}),
    Mode: new FormControl('All', {}),
    TrackPayment: new FormControl('Both', {}),
    EffectiveMonth: new FormControl(0, {}),
    InvoiceFrom: new FormControl('', {}),
    InvoiceTo: new FormControl('', {}),
    EffectiveFrom: new FormControl('', {}),
    EffectiveTo: new FormControl('', {}),
    TrackDateTo: new FormControl('', {}),
    TrackDateFrom: new FormControl('', {}),
    TermDateFrom: new FormControl('', {}),
    TermDateTo: new FormControl('', {}),
    TermReason: new FormControl('All', {}),
    OrderBy: new FormControl('None', {}),
    PremiumFrom: new FormControl('', {}),
    PremiumTo: new FormControl('', {}),
    EnrolleFrom: new FormControl('', {}),
    EnrolleTo: new FormControl('', {}),
    EligibleFrom: new FormControl('', {}),
    EligibleTo: new FormControl('', {}),
  });
  constructor(
    public getRouterparamter: GetRouteParamtersService,
    public reportManagersvc: ReportManagerService,
    public reportManagerURLSvc: ReportManagerURLService,
    public filters: ManagementFilters,
    public dialog: MatDialog,
    public toaster: ToastrService
  ) { }


  ngOnInit() {
    this.title = 'Report Manager';
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayeeListing();
    this.GetPayeeListprmtrs();
    this.filterText = '+ More filters'
  }
  OnMoreFilterShown() {
    if (this.filterText === '+ More filters') {
      this.filterText = '- Less filters'
    } else {
      this.filterText = '+ More filters'
    }
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
      if (isloadingDone && this.PayorsListProperties.miDataSource.getResponse) {
        if (!this.sortChange) {
          this.PayorsListProperties.miDataSource.getResponse.TotalRecords.push(
            { Checked: true, PayorName: 'blank', PayorID: Guid.createEmpty().toJSON().value, }
          );
          this.PayorsListProperties.miDataSource.getResponse.TotalLength = this.PayorsListProperties.miDataSource.getResponse.TotalLength + 1;
        }
      }
      if (isloadingDone && isloadingDone.length > 0) {

        this.PayorCount = this.PayorsListProperties.miDataSource.tableData.length;
        this.isPayorListfound = true;
      } else if (this.PayorsListProperties.miDataSource.pageLength >= 0) {

        this.isPayorListfound = true;
        this.PayorCount = this.PayorsListProperties.miDataSource.tableData.length;
      }
    });
  }
  GetCarrierListing() {
    this.url = this.reportManagerURLSvc.ManagementReport.GetCarrierList;
    this.CarrierListProperties.url = this.url
    this.CarrierListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.CarrierListProperties.displayedColumns = ['Checkbox', 'CarrierName'];
    this.CarrierListProperties.columnLabels = ['Checkbox', 'Carriers'];
    this.CarrierListProperties.columnIsSortable = ['false', 'true'];
    this.CarrierListProperties.refreshHandler = this.needProductRefresh;
    this.CarrierListProperties.resetPagingHandler = this.needPageReset;
    this.CarrierListProperties.miListMenu = new MiListMenu();
    this.CarrierListProperties.miListMenu.visibleOnDesk = true;
    this.CarrierListProperties.miListMenu.visibleOnMob = false;
    this.CarrierListProperties.showPaging = false;
    this.CarrierListProperties.pageSize = this.getRouterparamter.pageSize
    this.CarrierListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.CarrierListProperties.isEditablegrid = true;
    this.CarrierListProperties.isClientSideList = true;
    this.CarrierListProperties.clientSideSearch = this.searchList;
    this.CarrierListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    this.CarrierListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {

      if (isloadingDone && this.CarrierListProperties.miDataSource.getResponse) {
        if (!this.sortChange) {
          this.CarrierListProperties.miDataSource.getResponse.TotalRecords.push({
            Checked: true, CarrierName: 'blank',
            CarrierId: Guid.createEmpty().toJSON().value,
          });
          this.carrierCount = this.CarrierListProperties.miDataSource.getResponse.TotalLength;
          this.CarrierListProperties.miDataSource.getResponse.TotalLength =
            this.CarrierListProperties.miDataSource.getResponse.TotalLength + 1;
        }
        this.isCarrierListfound = true;
      }
    });

  }
  GetProductListing() {
    this.url = this.reportManagerURLSvc.ManagementReport.GetProductsList;
    this.ProductListProperties.url = this.url
    this.ProductListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.ProductListProperties.displayedColumns = ['Checkbox', 'Name'];
    this.ProductListProperties.columnLabels = ['Checkbox', 'Products'];
    this.ProductListProperties.columnIsSortable = ['false', 'true'];
    this.ProductListProperties.refreshHandler = this.needCarrierlistRefresh;
    this.ProductListProperties.resetPagingHandler = this.needPageReset;
    this.ProductListProperties.miListMenu = new MiListMenu();
    this.ProductListProperties.miListMenu.visibleOnDesk = true;
    this.ProductListProperties.miListMenu.visibleOnMob = false;
    this.ProductListProperties.showPaging = false;
    this.ProductListProperties.pageSize = this.getRouterparamter.pageSize
    this.ProductListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.ProductListProperties.isEditablegrid = true;
    this.ProductListProperties.isClientSideList = true;
    this.ProductListProperties.clientSideSearch = this.searchList;
    this.ProductListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }
    this.ProductListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {

      if (isloadingDone && this.ProductListProperties.miDataSource.getResponse) {
        if (!this.sortChange) {
          this.ProductListProperties.miDataSource.getResponse.TotalRecords.push({
            Checked: true,
            Name: 'blank',
            CoverageID: Guid.createEmpty().toJSON().value
          });
          this.productCount = this.ProductListProperties.miDataSource.getResponse.TotalLength;
          this.ProductListProperties.miDataSource.getResponse.TotalLength =
            this.ProductListProperties.miDataSource.getResponse.TotalLength + 1;
        }
        this.isProductListfound = true;
      }
    });

  }
  GetPayeeListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetPayeeList;
    this.PayeeListProperties.url = this.url
    this.PayeeListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.PayeeListProperties.displayedColumns = ['Checkbox', 'PayeeName'];
    this.PayeeListProperties.columnLabels = ['Checkbox', 'Brokers'];
    this.PayeeListProperties.columnIsSortable = ['false', 'true'];
    this.PayeeListProperties.refreshHandler = this.needPayeelistRefresh;
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
      if (isloadingDone && this.PayeeListProperties.miDataSource.getResponse) {
        if (!this.sortChange) {
          this.PayeeListProperties.miDataSource.getResponse.TotalRecords.push({
            Checked: true,
            PayeeName: 'blank',
            UserCredentialId: Guid.createEmpty().toJSON().value
          });
          this.PayeeCount = this.PayeeListProperties.miDataSource.getResponse.TotalLength;
          this.PayeeListProperties.miDataSource.getResponse.TotalLength =
            this.PayeeListProperties.miDataSource.getResponse.TotalLength + 1;
        }
        this.isPayeeListfound = true;
      }
    });
    this.GetPayorListing();
    this.GetPayorListPrmtrs();
  }

  GetSegmentListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetSegmentList;
    this.SegmentListProperties.url = this.url
    this.SegmentListProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.SegmentListProperties.displayedColumns = ['Checkbox', 'SegmentName'];
    this.SegmentListProperties.columnLabels = ['Checkbox', 'Segments'];
    this.SegmentListProperties.columnIsSortable = ['false', 'true'];
    this.SegmentListProperties.refreshHandler = this.needPayeelistRefresh;
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
      if (isloadingDone && this.SegmentListProperties.miDataSource.getResponse) {
          this.SegmentCount = this.SegmentListProperties.miDataSource.getResponse.TotalLength;
          this.SegmentListProperties.miDataSource.getResponse.TotalLength =
            this.SegmentListProperties.miDataSource.getResponse.TotalLength + 1;
      }
    });
  }

  GetReportNameListing() {
    this.url = this.reportManagerURLSvc.payeeStatementReport.GetReportNameListing;
    this.ReportNameProperties.url = this.url
    this.ReportNameProperties.miDataSource = new TableDataSource(this.reportManagersvc);
    this.ReportNameProperties.displayedColumns = ['Checkbox', 'Name', 'Description'];
    this.ReportNameProperties.columnLabels = ['Checkbox', 'Name', 'Details'];
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
    this.ReportNameProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    }

    this.ReportNameProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.ReportCount = this.ReportNameProperties.miDataSource.tableData.length;
        this.isReportListfound = true;
      } else if (this.ReportNameProperties.miDataSource.tableData && this.ReportNameProperties.miDataSource.tableData.length >= 0) {
        this.ReportCount = this.ReportNameProperties.miDataSource.tableData.length;
        this.isReportListfound = true;
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
    } else {
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
    } else {
      this.isSegmentSelected = false;
    }
  }
  OnReportNameRbtnClicked(value) {

    if (!value.data.Checked) {
      this.reportFilters.reset();
      this.reportFilters.controls.Type.setValue('Active/Pending');
      this.reportFilters.controls.Mode.setValue('All');
      this.reportFilters.controls.TrackPayment.setValue('Both');
      this.reportFilters.controls.EffectiveMonth.setValue(0);
      this.reportFilters.controls.TermReason.setValue('All');
      this.reportFilters.controls.OrderBy.setValue('None');
    }

    if(value.name === "radio-button")
    {
      value.data.Checked = !value.data.Checked
    }

    for (const ReportName of this.ReportNameProperties.miDataSource.tableData) {
      if(ReportName.Code === value.data.Code)
      {
        ReportName.Checked = true;
      }
      else
      {
        ReportName.Checked = false;
      }
    }
    
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isReportSelected = true;
      return;
    } else {
      this.isReportSelected = false;

    }
  }

  OnReportNameChkBoxClicked(value) {
    debugger;
    value.data.Checked = !value.data.Checked
    if (!value.data.Checked) {
      debugger;
      this.reportFilters.reset();
      this.reportFilters.controls.Type.setValue('Active/Pending');
      this.reportFilters.controls.Mode.setValue('All');
      this.reportFilters.controls.TrackPayment.setValue('Both');
      this.reportFilters.controls.EffectiveMonth.setValue(0);
      this.reportFilters.controls.TermReason.setValue('All');
      this.reportFilters.controls.OrderBy.setValue('None');
    }
    this.IsAllCheckboxSlected();
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isReportSelected = true;
      if ((value.data.Code === 'MRECR' || value.data.Code === 'MROS') && value.data.Checked === true) {
        this.isEcrReportSelected = true;
      } else {
        this.isEcrReportSelected = false;
      }
      return;
    } else {
      this.isReportSelected = false;

    }
  }
  OnExportButtonClick() {
    this.ReportNameProperties.miDataSource.tableData.filter(element => {
      if ((element.Code === 'MRECR' || element.Code === 'MROS') && element.Checked === true) {
        this.isEcrReportSelected = true;

      }
    });
  }
  OnValidateDate(fromDate: any, toDate: any, fieldName: any = ''): void {
    debugger;
    this.isformValid = true;
    if (fromDate && toDate) {
      this.isformValid =
        new Date(toDate).setHours(0, 0, 0, 0) > new Date(fromDate).setHours(0, 0, 0, 0);
    }
    if (!this.isformValid) {
      const data = {
        fieldName: fieldName,
        isFieldValid: this.isformValid
      };
      this.validationShownList.push(data);
      this.toolTipMessage = 'Please enter valid date in' + ' ' + fieldName + '.';
    }
    if (this.validationShownList.length > 0) {
      this.isformValid = false;
      this.validationShownList.forEach(fieldDetails => {
        this.toolTipMessage = 'Please enter valid date in' + ' ' + fieldDetails.fieldName + '.';
      });
    }

  }
  OnProductListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.ProductListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isProductSelected = true;
    } else {
      this.isProductSelected = false;
    }
  }
  OnCarrierListChkBoxClicked(value) {
    value.data.Checked = !value.data.Checked
    this.IsAllCheckboxSlected();
    if (this.CarrierListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isCarrierSelected = true;
      return;
    } else {
      this.isCarrierSelected = false;
    }
  }

  // ####################################################################################################################################
  IsAllCheckboxSlected() {
    debugger;
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.ReportNameProperties.miDataSource.tableData.length) {
      this.reportAllCheckBoxSelect = true;
    } else {
      debugger;
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

    if (this.PayorsListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.PayorsListProperties.miDataSource.tableData.length) {
      this.PayorAllCheckBoxSelect = true;
    } else {
      this.PayorAllCheckBoxSelect = false;
    }
    if (this.CarrierListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.CarrierListProperties.miDataSource.tableData.length) {
      this.carriersAllCheckBoxSelect = true;
    } else {
      this.carriersAllCheckBoxSelect = false;
    }
    if (this.ProductListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.ProductListProperties.miDataSource.tableData.length) {
      this.productAllCheckBoxSelect = true;
    } else {
      this.productAllCheckBoxSelect = false;
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
  OnCarrierListSlctAllCheckBoxes(value) {
    this.CarrierListProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.carriersAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.carriersAllCheckBoxSelect = !this.carriersAllCheckBoxSelect;
    if (this.CarrierListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isCarrierSelected = true;
      return;
    } else {
      this.isCarrierSelected = false;
    }
  }
  OnProductListSlctAllCheckBoxes(value) {
    this.ProductListProperties.miDataSource.tableData.forEach(element => {
      if (element) {
        const newValue = !this.productAllCheckBoxSelect as boolean
        (element.Checked as boolean) = newValue
      }
    });
    this.productAllCheckBoxSelect = !this.productAllCheckBoxSelect;
    if (this.ProductListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isProductSelected = true;
      return;
    } else {
      this.isProductSelected = false;
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
    if (!this.reportAllCheckBoxSelect) {
      this.isValidationShown = false;
    }
    if (this.ReportNameProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length > 0) {
      this.isReportSelected = true;
      this.isEcrReportSelected = true;
      return;
    } else {
      this.isReportSelected = false;
      this.isEcrReportSelected = false;
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
  AfterCarrierDataLoading() {
    if (this.CarrierListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.CarrierListProperties.miDataSource.tableData.length) {
      this.carriersAllCheckBoxSelect = true;
      this.isCarrierSelected = true;
    } else {
      this.carriersAllCheckBoxSelect = false;
    }
  }
  AfterProductDataLoading() {
    if (this.ProductListProperties.miDataSource.tableData.filter(x =>
      x.Checked === true).length === this.ProductListProperties.miDataSource.tableData.length) {
      this.productAllCheckBoxSelect = true;
      this.isProductSelected = true;
    } else {
      this.productAllCheckBoxSelect = false;
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
      'reportGroupName': 'Management'
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
    this.GetSegmentListing();
    this.GetSegmentListprmtrs();
    this.GetCarrierListing();
    this.GetCarrierListprmtrs();
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
  GetPayeeListprmtrs() {
    this.postdata = {
      'licenseeId': this.userdetails.LicenseeId
    };
    this.PayeeListProperties.requestPostData = this.postdata;
    this.PayeeListProperties.refreshHandler.next(true);
    this.GetReportNameListing();
    this.ReportNameListingPrmtrs();
  }
  GetCarrierListprmtrs() {
    this.postdata = {
      'licenseeId': this.userdetails.LicenseeId
    };
    this.CarrierListProperties.requestPostData = this.postdata;
    this.CarrierListProperties.refreshHandler.next(true);
    this.GetProductListing();
    this.GetProductListprmtrs();
  }
  GetProductListprmtrs() {
    this.postdata = {
      'licenseeId': this.userdetails.LicenseeId
    };
    this.ProductListProperties.requestPostData = this.postdata;
    this.ProductListProperties.refreshHandler.next(true);
  }
  GetReportListData() {
    let payors = '';
    let payees = '';
    let segments = '';
    let reportName = '';
    let carriers = '';
    let products = '';
    if (this.PayorsListProperties.miDataSource.tableData && this.PayorsListProperties.miDataSource.tableData.length > 0) {
      for (const payorData of this.PayorsListProperties.miDataSource.tableData) {
        if (payorData.Checked === true) {
          payors += payorData.PayorID + ',';
        }
      }
      this.payor = payors;
      const payorList = this.payor.substring(0, this.payor.length - 1);
      debugger;
      if (payorList) {
        const payorCount = payorList.split(',').length;
        if (payorCount === this.PayorsListProperties.miDataSource.tableData.length) {
          this.payor = this.payor + 'All';
        }
        else if (payorCount === 1) {
          let id = this.payor.replace(',', '');
          this.payor = (id === Guid.createEmpty().toJSON().value) ? this.payor + 'OnlyBlank' : this.payor + 'OnlyIDs';
        }
        else {
            var payorArr = [];
            var emptyCountPayor = 0;
            payorArr = this.payor.split(',');
            payorArr.some(function(value, index, _aryFunc) {
              if(value === "00000000-0000-0000-0000-000000000000")
              {
                emptyCountPayor = 1;
              }
            });
            if(emptyCountPayor === 1)
            {
              this.payor = this.payor + 'All';
            }
            else
            {
              this.payor = this.payor + 'OnlyIDs';
            }
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
        else if (payeeCount === 1) {
          let id = this.payees.replace(',', '');
          this.payees = (id === Guid.createEmpty().toJSON().value) ? this.payees + 'OnlyBlank' : this.payees + 'OnlyIDs';
        }
        else {
            var payeesArr = [];
            var emptyCountPayees = 0;
            payeesArr = this.payees.split(',');
            payeesArr.some(function(value, index, _aryFunc) {
              if(value === "00000000-0000-0000-0000-000000000000")
              {
                emptyCountPayees = 1;
              }
            });
            if(emptyCountPayees === 1)
            {
              this.payees = this.payees + 'All';
            }
            else
            {
              this.payees = this.payees + 'OnlyIDs';
            }
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
        const segmentCount = this.segments.split(',').length;
        if (segmentCount === this.SegmentListProperties.miDataSource.tableData.length) {
          this.segments = this.segments + ',' +'All';
        }
        else if (segmentCount === 1) {
          let id = this.segments.replace(',', '');
          this.segments = (id === Guid.createEmpty().toJSON().value) ? this.segments + ',' + 'OnlyBlank' : this.segments + ',' + 'OnlyIDs';
        }
        else {
          var segArr = [];
          var emptyCount = 0;
          segArr = this.segments.split(',');
          segArr.some(function(value, index, _aryFunc) {
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
        }
      }
    }
    if (this.ReportNameProperties.miDataSource.tableData && this.ReportNameProperties.miDataSource.tableData.length > 0) {
      for (const ReportName of this.ReportNameProperties.miDataSource.tableData) {
        if (ReportName.Checked === true) {
          reportName += ReportName.Code + ',';
        }
      }
      this.reportName = reportName;
      const reports = this.reportName.substring(0, reportName.length - 1)
      if (reports) {
        const reportCount = reports.split(',').length;
        if (reportCount === this.ReportNameProperties.miDataSource.tableData.length) {
          this.reportName = this.reportName + 'All'
        }
      }
    }
    if (this.CarrierListProperties.miDataSource.tableData && this.CarrierListProperties.miDataSource.tableData.length > 0) {
      for (const carrierData of this.CarrierListProperties.miDataSource.tableData) {
        if (carrierData.Checked === true) {
          carriers += carrierData.CarrierId + ',';
        }
      }
      this.checkedCarriers = carriers;
      const carrier = this.checkedCarriers.substring(0, this.checkedCarriers.length - 1)
      if (carrier) {
        const reportCount = carrier.split(',').length;
        if (reportCount === this.CarrierListProperties.miDataSource.tableData.length) {
          this.checkedCarriers = this.checkedCarriers + 'All'
        }
        else if (reportCount === 1) {
          let id = this.checkedCarriers.replace(',', '');
          this.checkedCarriers = (id === Guid.createEmpty().toJSON().value) ? this.checkedCarriers + 'OnlyBlank' : this.checkedCarriers + 'OnlyIDs';
        }
        else {
            var checkedCarriersArr = [];
            var emptyCountCarriers = 0;
            checkedCarriersArr = this.checkedCarriers.split(',');
            checkedCarriersArr.some(function(value, index, _aryFunc) {
              if(value === "00000000-0000-0000-0000-000000000000")
              {
                emptyCountCarriers = 1;
              }
            });
            if(emptyCountCarriers === 1)
            {
              this.checkedCarriers = this.checkedCarriers + 'All';
            }
            else
            {
              this.checkedCarriers = this.checkedCarriers + 'OnlyIDs';
            }
        }
      }
    }
    if (this.ProductListProperties.miDataSource.tableData && this.ProductListProperties.miDataSource.tableData.length > 0) {
      for (const productData of this.ProductListProperties.miDataSource.tableData) {
        if (productData.Checked === true) {
          products += productData.CoverageID + ',';
        }
      }
      this.checkProductList = products;
      const productslst = this.checkProductList.substring(0, this.checkProductList.length - 1);

      if (productslst) {
        const productCount = productslst.split(',').length;
        if (productCount === this.ProductListProperties.miDataSource.tableData.length) {
          this.checkProductList = this.checkProductList + 'All'
        }
        else if (productCount === 1) {
          let id = this.checkProductList.replace(',', '');
          this.checkProductList = (id === Guid.createEmpty().toJSON().value) ? this.checkProductList + 'OnlyBlank' : this.checkProductList + 'OnlyIDs';
        }
        else {
            var checkProductListArr = [];
            var emptyCountProductList = 0;
            checkProductListArr = this.checkProductList.split(',');
            checkProductListArr.some(function(value, index, _aryFunc) {
              if(value === "00000000-0000-0000-0000-000000000000")
              {
                emptyCountProductList = 1;
              }
            });
            if(emptyCountProductList === 1)
            {
              this.checkProductList = this.checkProductList + 'All';
            }
            else
            {
              this.checkProductList = this.checkProductList + 'OnlyIDs';
            }
        }
      }
    }
  }
  mmDDyyyFormat = (date: Date): string => {

    if (date) {
      return ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    }
  }
  OnValidateECRReport(): void {
    this.ReportNameProperties.miDataSource.tableData.filter(item => {
      if (item.Code === 'MRECR' && item.Checked) {
        this.isMRECRReportSlct = true;
        if (!this.reportFilters.controls.InvoiceFrom.value && !this.reportFilters.controls.InvoiceTo.value) {
          this.isValidationShown = true;
          this.ValidationMessage = 'Please enter "Invoice From" and "Invoice To" for Expected Commissions Report.';
        } else {
          let InvoiceFromMonth;
          let InvoiceTo;
          InvoiceFromMonth = new Date(this.reportFilters.controls.InvoiceFrom.value);
          InvoiceFromMonth = InvoiceFromMonth;
          InvoiceTo = new Date(this.reportFilters.controls.InvoiceTo.value);
          InvoiceTo = InvoiceTo;
          if (InvoiceTo.getFullYear() - InvoiceFromMonth.getFullYear() > 2) {
            this.isValidationShown = true;
            this.ValidationMessage = `Interval between 'InvoiceFrom' and 'InvoiceTo' cannot be more than 24 months.`
          } else {
            this.isValidationShown = false;
          }
        }
      }
      else if (item.Code === 'MRECR' && !item.Checked) {
        this.isValidationShown = false;
        this.isMRECRReportSlct = false;
      }

    });

  }

  PrintReport(format) {
    this.OnValidateECRReport()
    if (this.isValidationShown === false) {
        if (this.isMRECRReportSlct === true) {
        this.openEmailDialog(format);
      } else {
        this.SaveReport(format);
      }

    }
  }
  SaveReport(format) { debugger;
    this.GetReportListData();
    this.postdata = {
      'report':
        {
          'PayorIds': this.payor,
          'AgentIds': this.payees,
          'SegmentIds': this.segments,
          'ProductIds': this.checkProductList,
          'CarrierIds': this.checkedCarriers,
          'LicenseeId': this.userdetails.LicenseeId,
          'ReportNames': this.reportName,
          'ReportId': Guid.create().toJSON().value,
          'OrderBy': this.reportFilters.controls.OrderBy.value,
          'PolicyMode': this.reportFilters.controls.Mode.value,
          'EffectiveMonth': this.reportFilters.controls.EffectiveMonth.value !== 13 ?
            this.reportFilters.controls.EffectiveMonth.value : null,
          'PolicyTermReason': this.reportFilters.controls.TermReason.value,
          'TrackPayment': this.reportFilters.controls.TrackPayment.value,
          'PolicyType': this.reportFilters.controls.Type.value,
          'InvoiceFromString': this.mmDDyyyFormat(this.reportFilters.controls.InvoiceFrom.value),
          'InvoiceToString': this.mmDDyyyFormat(this.reportFilters.controls.InvoiceTo.value),
          'ReportType': format,
          'FromEffectiveDateString': this.mmDDyyyFormat(this.reportFilters.controls.EffectiveFrom.value),
          'ToEffectiveDateString': this.mmDDyyyFormat(this.reportFilters.controls.EffectiveTo.value),
          'FromTrackDateString': this.mmDDyyyFormat(this.reportFilters.controls.TrackDateFrom.value),
          'ToTrackDateString': this.mmDDyyyFormat(this.reportFilters.controls.TrackDateTo.value),
          'FromTermDateString': this.mmDDyyyFormat(this.reportFilters.controls.TermDateFrom.value),
          'ToTermDateString': this.mmDDyyyFormat(this.reportFilters.controls.TermDateTo.value),
          'BeginPremium': this.reportFilters.controls.PremiumFrom.value ? this.reportFilters.controls.PremiumFrom.value : null,
          'EndPremium': this.reportFilters.controls.PremiumTo.value ? this.reportFilters.controls.PremiumTo.value : null,
          'BeginEnrolled': this.reportFilters.controls.EnrolleFrom.value ? this.reportFilters.controls.EnrolleFrom.value : null,
          'EndEnrolled': this.reportFilters.controls.EnrolleTo.value ? this.reportFilters.controls.EnrolleTo.value : null,
          'BeginEligible': this.reportFilters.controls.EligibleFrom.value ? this.reportFilters.controls.EligibleFrom.value : null,
          'EndEligible': this.reportFilters.controls.EligibleTo.value ? this.reportFilters.controls.EligibleTo.value : null,
          'Email': this.EmailIds,
        },
      'userCredentialId': this.userdetails.UserCredentialID
    };
    if(this.isMRECRReportSlct === false) {
      this.showLoader = true;
    }
    const url = this.reportManagerURLSvc.ManagementReport.SaveManagementReport;
    
    this.reportManagersvc.SaveReportDetails(this.postdata, url).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        if(this.isMRECRReportSlct === true) 
        {
            this.showLoader = false;
        }
        else 
        {
          this.showLoader = false;
          const element = response.ReportObject;
          const anchor = document.createElement('a');
          const fileExt = element.FileName.slice((element.FileName.lastIndexOf('.') - 1 >>> 0) + 2);
          if (fileExt) 
          {
            anchor.href = ServerURLS.ReportURL + element.FileName;
			
            if (fileExt.toLowerCase() === 'pdf') 
            {
              anchor.target = '_blank';
              anchor.download = element.FileName;
            }
			
            document.body.appendChild(anchor);
			
            anchor.click();
            document.body.removeChild(anchor);
          }
        }
      }
      else{
        this.showLoader=false;
        this.toaster.error("An error occur while executing reports.");
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
        this.isMRECRReportSlct = false;
        //alert("in5");
      } else {
        //alert("in6");
        //this.showLoader = true;
        this.EmailIds = result;
        this.SaveReport(format);
      }
    }
    );
  }
  OnSortChange(value) {
    debugger;
    this.sortChange = value.result;
  }
}
