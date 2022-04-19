import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { CommonDataService } from '../../_services/common-data.service';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListFieldType } from '../../shared/mi-list/mi-list-field-type';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject, BehaviorSubject } from 'rxjs';
import { TableDataSource } from '../../_services/table.datasource';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ResponseCode } from '../../response.code';
import { ToastrService } from 'ngx-toastr';
import { ServerURLS } from './../../../assets/config/CONSTANTS';
import { CommonMethodsService } from '../../_services/common-methods.service';
import { DeuFieldDataCollection, DEUFormField } from '../post-data-entry/common-classes';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { PostedFieldCollection } from '../post-data-entry/deu-field-post-entry-classes';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { CurrencyPipe } from '@angular/common';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { DataEntryUnitService } from '../data-entry-unit.service';
@Component({
  selector: 'app-post-data-entry',
  templateUrl: './post-data-entry.component.html',
  styleUrls: ['./post-data-entry.component.scss'],
  providers: [CurrencyPipe]
})
export class PostDataEntryComponent implements OnInit, OnDestroy {
  batchList: MiProperties = new MiProperties();
  statementList: MiProperties = new MiProperties();
  postedPaymentList: MiProperties = new MiProperties();
  isListRefresh: any = new BehaviorSubject<boolean>(false);
  isPaymentListRefresh: Subject<boolean> = new Subject<any>();
  userDetails: any;
  showLoader: Boolean = false;
  templateList: any = [];
  payorList: any = [];
  PayorListing: any;
  selectedBatchIndex: any = -1;
  lastPaymentRecord: any;
  selectedRecord: any;
  selectedStatementIndex: any = -1;
  postedPaymentIndex: any = 0;
  batchListNeedRefresh: Subject<boolean> = new Subject();
  statementListNeedRefresh: Subject<boolean> = new Subject();
  totalPercentage: any = 0;
  postedPaymentListNeedRefresh: Subject<boolean> = new Subject();
  isPageReset: Subject<boolean> = new Subject();
  batchCount: Number = 0;
  statementCount: Number = 0;
  StatementInfoGroup: FormGroup = new FormGroup({
    PayorId: new FormControl('', {}),
    PayorName: new FormControl('', {}),
    TemplateId: new FormControl('', {}),
    BatchNumber: new FormControl('', {}),
    StatementNumber: new FormControl('', {}),
    BatchId: new FormControl(Guid.createEmpty().toJSON().value, {}),
    StatementId: new FormControl(Guid.createEmpty().toJSON().value, {}),
    CheckAmount: new FormControl('0.00', {}),
    StatementDate: new FormControl('', {}),
    StatementStatusId: new FormControl('', {}),
    BalForAdj: new FormControl('0.00', {}),
    Pages: new FormControl('', {}),
    StatmentStatus: new FormControl('', {}),
    NetCheckAmount: new FormControl('0.00', {}),
    EnteredAmount: new FormControl('0.00', {}),
    licenseeeId: new FormControl(Guid.createEmpty().toJSON().value, {}),
    OldPayorId: new FormControl('', {}),
    OldTemplateId: new FormControl('', {}),
    PaymentEntriesCount: new FormControl('', {})
  });

  // columnIsSortable: string[] = ['true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true'];
  isClientSideList: Boolean = true;
  isStatmentListShown: Boolean = false;
  isTemplateDataShown: Subject<boolean> = new Subject<any>();
  public isSelectedPaymentDetails: any = new BehaviorSubject<any>(undefined);
  policyLearnedFields: any = new BehaviorSubject<any>(undefined);
  public searchPolicyParameters: any = new BehaviorSubject<any>({});
  isPaymetListRefresh: Subject<boolean> = new Subject<boolean>();
  PageResetHandler: Subject<any> = new Subject<any>();
  scrollingBatchCoordinate: Number = 0;
  scrollingStatementCoordinate: Number = 0;
  isSearchPolicyListShown: Boolean = false;
  isPostedPaymentListShown: Boolean = false;
  lastStatementDate: any;

  selectedStatmentRecord: any;
  isFindStatamentNumber: Boolean = false;
  public onFixedDivScroll: any = new BehaviorSubject<any>({});
  matTabIndex: Number = 0;
  errorCount: any = 0;
  pageDetails: any;

  constructor(
    public sendAPIRequest: CommonDataService,
    public toaster: ToastrService,
    public dialog: MatDialog,
    private currencyFormat: CurrencyPipe,
    public commonMethodSvc: CommonMethodsService,
    public appDataSvc: AppLevelDataService,
    public dataEntryUnitSvc: DataEntryUnitService
  ) {
    this.appDataSvc.isHeaderShown = false;
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayorList();
    this.GetBatchList();
    this.GetStatementList();
    this.isPostedPaymentListShown = true;
    this.OnGettingPostedPaymentList();
    this.OnResetSearchedPolicyGrid();

  }
  OnCloseFullView(): void {
    this.appDataSvc.isHeaderShown = !this.appDataSvc.isHeaderShown;
  }
  GetTemplateList(isPayorRefresh: Boolean): void {

    // console.log('inside gettemplatelist, ispayorRefresh' + isPayorRefresh);
    const PayorId = this.OnGettingPayorId();
    if (PayorId) {
      this.StatementInfoGroup.controls.PayorId.setValue(PayorId);
      const postData = {
        'payorId': this.StatementInfoGroup.controls.PayorId.value,
      };
      postData['URL'] = 'GetDEUTemplateList';
      this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
        if (ResponseCode.SUCCESS === response.ResponseCode) {
          this.templateList = response.TotalRecords;

          // Case when some template from old data is not in new list of templates 
          let isTemplateinList = true;
          if (this.StatementInfoGroup.controls.TemplateId.value &&
            this.StatementInfoGroup.controls.TemplateId.value !== Guid.createEmpty().toJSON().value) {
            isTemplateinList = this.templateList.find(x => x.TemplateID === this.StatementInfoGroup.controls.TemplateId.value)
          }
          // console.log('inside gettemplatelist,isTemplateinList, ' + isTemplateinList);
          // console.log('this.StatementInfoGroup.controls.TemplateId.value: ' + this.StatementInfoGroup.controls.TemplateId.value);
          if (isPayorRefresh || // new payor selected
            !this.StatementInfoGroup.controls.TemplateId.value || // undefined template
            this.StatementInfoGroup.controls.TemplateId.value === Guid.createEmpty().toJSON().value ||
            !isTemplateinList)// template from old data
          {
            this.StatementInfoGroup.controls.TemplateId.setValue(response.TotalRecords[0].TemplateID);
            // console.log('inside gettemplatelist, deefault selt');
          }
          else {
            // console.log('inside gettemplatelist, deefault NOT selt');
          }

          this.isTemplateDataShown.next(true);
        }
      });
    } else {
      return;
    }
  }
  GetTemplateDetails(): void {

    if (!this.StatementInfoGroup.controls.TemplateId.value) {

      this.StatementInfoGroup.controls.TemplateId.setValue(Guid.createEmpty().toJSON().value);
    }
    this.isTemplateDataShown.next(true);
  }
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  /*
  CreatedBy:AcmeMinds
  CreatedOn:04-Feb-2020
  Purpose:Getting List of Templates based on payor name
  */
  GetPayorList(): void {
    const Userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    const postData = {
      'licenseeId': Userdetails['LicenseeId'],
    };
    postData['URL'] = 'GetDEUPayorList';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      if (ResponseCode.SUCCESS === response.ResponseCode) {
        this.payorList = response.PayorList;
        this.StatementInfoGroup.controls.PayorName.setValue(response.PayorList[0].PayorName);
        this.PayorListing = this.StatementInfoGroup.controls.PayorName.valueChanges.pipe(
          startWith(''),
          map(value => this._Payorfilter(value))
        );
        this.StatementInfoGroup.controls.PayorId.setValue(response.PayorList[0].PayorID);
        this.GetTemplateList(true);
      }
    });
  }
  OnGettingPayorName(payorId: any): any {
    const index = this.payorList.findIndex(payor => payor.PayorID === payorId);
    if (this.payorList[index]) {
      return this.payorList[index].PayorName;
    } else {
      this.StatementInfoGroup.controls.PayorId.setValue('');
      return '';
    }

  }
  OnGettingPayorId(): any {
    const payorName = this.StatementInfoGroup.controls.PayorName.value;
    const index = this.payorList.findIndex(payor => payor.PayorName === payorName);
    if (this.payorList[index]) {
      return this.payorList[index].PayorID;
    } else {
      return '';
    }

  }
  _Payorfilter(value: string): string[] {
    let filterValue = value;
    if (value) {
      filterValue = value.toLowerCase();
    }
    return this.payorList.filter(option =>
      option.PayorName.toLowerCase().indexOf(filterValue) === 0);
  }
  // ###################################################################################################################
  // ********************************************* Batch Section****************************************************** */
  /*
   CreatedBy:Acmeminds
  CreatedFor:Get Batch List
  CreatedOn:25-04-2020 
  */
  GetBatchList(): any {
    const url = '/api/CommonData/CommTableListRequestSends';
    this.batchList.url = url;
    this.batchList.miDataSource = new TableDataSource(this.sendAPIRequest);
    this.batchList.columnLabels = ['Batch #', 'Status', 'Entry User', 'Created', 'Agency', 'Last Edit'];
    this.batchList.displayedColumns = ['BatchNumber', 'EntryStatusString', 'AssignedDeuUserName',
      'CreatedDateString', 'LicenseeName', 'LastModifiedDateString'];
    this.batchList.refreshHandler = this.batchListNeedRefresh;
    this.batchList.columnDataTypes = [['BatchNumber', 'number'],
    ['EntryStatusString', 'string'],
    ['AssignedDeuUserName', 'string'],
    ['CreatedDateString', 'date'],
    ['LicenseeName', 'string'],
    ['LastModifiedDateString', 'date']];
    // this.batchList.columnIsSortable = this.columnIsSortable;
    this.batchList.isClientSideList = this.isClientSideList;
    this.batchList.showPaging = false;
    this.batchList.requestPostData = { 'URL': 'GetDEUBatchList', 'LicenseeId': Guid.createEmpty().toJSON().value };
    this.batchList.refreshHandler.next(true);
    this.batchList.miDataSource.dataSubject.subscribe(isLoadingDone => {
      if (isLoadingDone && this.batchList.miDataSource.getResponse) {
        this.isStatmentListShown = true;
        //  this.GetStatementList();
        this.batchCount = this.batchList.miDataSource.getResponse.TotalRecords.length;
      }
    });

  }

  /*
    CreatedBy:Acmeminds
   CreatedFor:On change batch selection 
   CreatedOn:25-04-2020 
   */
  OnBatchChange(selectedBatch: any): void {
    this.isFindStatamentNumber = false;
    this.selectedRecord = selectedBatch.data;
    this.selectedStatementIndex = 0;
    this.selectedBatchIndex = selectedBatch.index;
    this.StatementInfoGroup.controls.BatchNumber.setValue(selectedBatch.data.BatchNumber);
    this.StatementInfoGroup.controls.BatchId.setValue(selectedBatch.data.BatchId);
    this.StatementInfoGroup.controls.licenseeeId.setValue(selectedBatch.data.LicenseeId);
    this.GetStatementList();
    // this.dataEntryUnitSvc.islistFirstTimeLoad = true;

  }
  /*
    CreatedBy:Acmeminds
   CreatedFor:Batch marked close and not shown in List 
   CreatedOn:25-04-2020 
   */

  OnCloseBatch(): void {
    // this.dataEntryUnitSvc.islistFirstTimeLoad = true;
    this.showLoader = true;
    const postData = {
      'batchNumber': this.StatementInfoGroup.controls.BatchNumber.value
    };
    postData['URL'] = 'DEUBatchClose';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      this.showLoader = false;
      if (ResponseCode.SUCCESS === response.ResponseCode && response.result) {
        this.toaster.success(response.Message);
        this.batchList.refreshHandler.next(true);
        this.selectedBatchIndex = 0;
        this.isStatmentListShown = false;
      } else {
        this.toaster.error(response.Message);
      }
    });
  }
  /* 
   CreatedBy:Acmeminds
  CreatedFor:Find a batch in Batch list 
  CreatedOn:25-04-2020 
  */
  OnFindBatch(): void {

    // this.dataEntryUnitSvc.islistFirstTimeLoad = true;
    const findBatch = this.StatementInfoGroup.controls.BatchNumber.value;
    if (findBatch) {
      const isBatchFound: Boolean = this.OnCheckBatchExist(findBatch);
      isBatchFound ? this.toaster.success('Batch found successfully. ') :
        this.toaster.error('Entered batch not found in the system.');
    }
  }
  /*
  CreatedBy:Acmeminds
  CreatedFor:Check is batch exist in list or not
  CreatedOn:25-04-2020 
  */
  OnCheckBatchExist(batchNumber: any): Boolean {
    // console.log('Inside OnCheckBatchExist response 1');
    let isBatchFound: Boolean = false;
    if (this.batchList.miDataSource.getResponse) {
      // console.log('Inside OnCheckBatchExist response 2');
      this.batchList.miDataSource.getResponse.TotalRecords.forEach((details, index) => {
        if (details.BatchNumber === batchNumber) {
          this.selectedBatchIndex = index;
          isBatchFound = true;

          return isBatchFound;
        }
      });
    }
    return isBatchFound;
  }

  /*
  CreatedBy:Acmeminds
  CreatedFor:clear  a batch  details and no batch selection shon in batch List
  CreatedOn:25-04-2020 
  */
  OnClearBatchDetails(): void {

    this.dataEntryUnitSvc.buttonText = 'Start Edit';
    this.OnResetSearchedPolicyGrid();
    this.StatementInfoGroup.reset();
    this.StatementInfoGroup.controls.PayorId.setValue(this.payorList[0].PayorID);
    this.StatementInfoGroup.controls.PayorName.setValue(this.payorList[0].PayorName);
    this.StatementInfoGroup.controls.EnteredAmount.setValue('0.00');
    this.StatementInfoGroup.controls.NetCheckAmount.setValue('0.00');
    this.StatementInfoGroup.controls.CheckAmount.setValue('0.00');
    this.StatementInfoGroup.controls.BalForAdj.setValue('0.00');
    this.StatementInfoGroup.controls.StatementDate.setValue('');
    this.StatementInfoGroup.controls.StatementId.setValue(Guid.createEmpty().toJSON().value);
    this.lastStatementDate = '';
    this.selectedBatchIndex = -1;
    this.selectedStatementIndex = -1;
    this.totalPercentage = '0.00';
    this.selectedStatmentRecord = '';
    this.StatementInfoGroup.controls.BalForAdj.enable();
    this.StatementInfoGroup.controls.CheckAmount.enable();
    this.GetStatementList();
    this.GetTemplateList(true);
    this.OnGettingPostedPaymentList();
  }
  OnResetSearchedPolicyGrid(): void {
    const data = {
      'LicenseeId': '',
      'uniqueIdentifiers': [],
      'PayorId': ''
    };

    data.LicenseeId = this.StatementInfoGroup.controls.licenseeeId.value;
    data.PayorId = this.StatementInfoGroup.controls.PayorId.value;
    data.uniqueIdentifiers = null;
    this.searchPolicyParameters.next(data);
    this.isSearchPolicyListShown = true;
  }
  OnFieldValueClear(event: any): void {
    // 
    if (event.target.value == '') {

      this.OnClearBatchDetails();
    }
  }
  /*
  CreatedBy:Acmeminds
  CreatedFor:this method is used for Reopen a closed batch
  CreatedOn:25-04-2020 
  */
  OnBatchReOpen(): void {
    let isBatchExistInList: Boolean = false;
    if (this.batchList.miDataSource.getResponse.TotalRecords) {
      this.batchList.miDataSource.getResponse.TotalRecords.forEach(item => {
        if (item.BatchNumber === this.StatementInfoGroup.controls.BatchNumber.value) {
          isBatchExistInList = true;
          this.toaster.info('Entered batch already opened.');
        }
      });
    }
    if (!isBatchExistInList) {
      const dilogref = this.dialog.open(ShowConfirmationComponent, {
        data: {
          headingTitle: 'Re-open batch',
          subTitle: 'Are you sure you want to reopen this batch?'
        },
        width: '400px'
      });
      dilogref.afterClosed().subscribe(result => {
        if (result) {

          this.showLoader = true;
          const reopenBatchNumber = this.StatementInfoGroup.controls.BatchNumber.value;
          const postData = {
            'batchNumber': reopenBatchNumber
          };
          postData['URL'] = 'DEUBatchReOpen';
          this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
            //   this.dataEntryUnitSvc.islistFirstTimeLoad = true;
            if (ResponseCode.SUCCESS === response.ResponseCode && response.result && response.isRecordExist) {
              this.toaster.success('Batch Re-open successfully.');
              this.batchList.refreshHandler.next(true);
              const timeout = setInterval(() => {
                if (this.OnCheckBatchExist(reopenBatchNumber)) {
                  clearInterval(timeout);
                }
                this.showLoader = false;
              }, 500);
            } else if (ResponseCode.SUCCESS === response.ResponseCode && !response.isRecordExist) {
              this.toaster.error('Entered batch not found in the system.');
              this.showLoader = false;
            } else {
              this.toaster.error('Error occured please try after sometime.');
              this.showLoader = false;
            }
          });
        }
      });
    }
  }

  // ################################################################################################
  OnViewFile(recordSelected: any): void {
    const anchor = document.createElement('a');
    const fileExt = recordSelected.FileName.slice((recordSelected.FileName.lastIndexOf('.') - 1 >>> 0) + 2);
    if (fileExt) {
      if (fileExt.toLowerCase() === 'pdf') {
        anchor.href = ServerURLS.PDFURL + recordSelected.FileName;
        anchor.target = '_blank';
      } else {
        anchor.href = ServerURLS.XLSURL + recordSelected.FileName;
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
  // ************************************Mehod relate to statement Number****************************************************  */
  GetStatementList(): any {
    
    this.statementList.requestPostData = { 'URL': 'GetDEUStatementList', 'batchId': this.StatementInfoGroup.controls.BatchId.value };
    const url = '/api/CommonData/CommTableListRequestSends';
    this.statementList.url = url;
    this.statementList.miDataSource = new TableDataSource(this.sendAPIRequest);
    this.statementList.columnLabels = ['Statement', 'Status', 'Check Amt', 'Entered', 'DEU', 'Last Edit'];
    this.statementList.displayedColumns = ['StatementNumber', 'StatusName',
      'CheckAmountString', 'CreatedDateString', 'CreatedByDEU', 'LastModifiedDateString'];
    this.statementList.columnDataTypes = [['StatementNumber', 'number'],
    ['CheckAmountString', 'number'],
    ['CreatedDateString', 'date'],
    ['LastModifiedDateString', 'date']];
    //this.statementList.columnIsSortable = this.columnIsSortable;
    this.statementList.isClientSideList = this.isClientSideList;
    this.statementList.refreshHandler = this.statementListNeedRefresh;
    this.statementList.showPaging = false;
    this.statementList.refreshHandler.next(true);
    this.isStatmentListShown = true;
    this.statementList.miDataSource.dataSubject.subscribe(isLoadingDone => {
      this.statementCount = 0;
      if (isLoadingDone && this.statementList.miDataSource.getResponse) {
        this.showLoader = false;
        this.statementCount = this.statementList.miDataSource.getResponse.TotalRecords.length;

        if (!this.isFindStatamentNumber) {
          this.scrollingStatementCoordinate = 0;
          this.isListRefresh.next(true);
        }
      }
    });
  }
  OnStatementChange(selectedStatement: any): void {
    // 
    if (selectedStatement.actionName === 'row-click') {
      this.selectedStatementIndex = selectedStatement.index;
    } else {
      this.OnStatementDetailsChange(selectedStatement);
    }
  }
  OnStatementDetailsChange(selectedStatement: any): void {
    // 
    this.errorCount = 0;
    this.postedPaymentList.cachedList = null;
    this.dataEntryUnitSvc.buttonText = 'Start Edit';
    this.OnResetServiceVariables();
    if (selectedStatement.data) {
      if (selectedStatement.data.StatusName === 'Close') {
        this.StatementInfoGroup.controls.BalForAdj.disable();
        this.StatementInfoGroup.controls.CheckAmount.disable();
      } else {
        this.StatementInfoGroup.controls.BalForAdj.enable();
        this.StatementInfoGroup.controls.CheckAmount.enable();
      }
      this.selectedStatmentRecord = selectedStatement.data;
      this.StatementInfoGroup.controls.StatmentStatus.setValue(selectedStatement.data.StatusName);
      this.StatementInfoGroup.controls.StatementNumber.setValue(selectedStatement.data.StatementNumber);
      this.StatementInfoGroup.controls.StatementId.setValue(selectedStatement.data.StatementID);
      this.StatementInfoGroup.controls.PayorId.setValue(selectedStatement.data.PayorId);
      this.StatementInfoGroup.controls.PayorName.setValue(this.OnGettingPayorName(selectedStatement.data.PayorId));
      this.StatementInfoGroup.controls.TemplateId.setValue(selectedStatement.data.TemplateID);
      const balAdjValue = this.OnConvertCurrencyFormat(selectedStatement.data.BalanceForOrAdjustment);
      this.StatementInfoGroup.controls.BalForAdj.setValue(balAdjValue);
      const checkAmnt = this.OnConvertCurrencyFormat(selectedStatement.data.CheckAmount);
      this.StatementInfoGroup.controls.CheckAmount.setValue(checkAmnt);
      this.StatementInfoGroup.controls.EnteredAmount.setValue(selectedStatement.data.EnteredAmountString);
      this.StatementInfoGroup.controls.NetCheckAmount.setValue(selectedStatement.data.NetAmountString);
      this.StatementInfoGroup.controls.StatementDate.setValue(new Date(selectedStatement.data.StatementDateString));
      this.StatementInfoGroup.controls.StatementStatusId.setValue(selectedStatement.data.StatusId);
      this.lastStatementDate = new Date(selectedStatement.data.StatementDateString);
      this.StatementInfoGroup.controls.OldPayorId.setValue(selectedStatement.data.PayorId);
      this.StatementInfoGroup.controls.OldTemplateId.setValue(selectedStatement.data.TemplateID);
      this.totalPercentage = selectedStatement.data.CompletePercentageString;
      if (selectedStatement.data.FromPage) {
        this.StatementInfoGroup.controls.Pages.setValue(selectedStatement.data.FromPage + '-' + selectedStatement.data.ToPage);
      } else {
        this.StatementInfoGroup.controls.Pages.setValue('');
      }
      this.isPostedPaymentListShown = true;
      this.OnGettingPostedPaymentList();
      this.GetTemplateList(false);
      // this.calculatePercentage();
      this.OnResetSearchedPolicyGrid();
    } else {
      const batchId = this.StatementInfoGroup.controls.BatchId.value;
      const batchNumber = this.StatementInfoGroup.controls.BatchNumber.value;
      const batchIndex = this.selectedBatchIndex;
      this.OnClearBatchDetails();

      this.StatementInfoGroup.controls.BatchId.setValue(batchId);
      this.StatementInfoGroup.controls.BatchNumber.setValue(batchNumber);
      this.selectedBatchIndex = batchIndex;
      this.isPostedPaymentListShown = true;

    }
  }

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  
  /* 
  CreatedBy:Ankit khandelwal
  CreatedOn:27-05-2020
  Purpose:For close statement and for close+new statement 
  */
  CloseDialogBoxShown(isNewStatemntCreate: any): void {
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Statement Close',
        subTitle: 'Are you sure you want to close the selected statement?'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.OnCloseStatamentAPICall(isNewStatemntCreate);
      }
    });
  }
  OnCloseStatamentAPICall(isNewStatemntCreate: any): void {
    this.showLoader = true;
    const postData = {
      'statementNumber': Number(this.StatementInfoGroup.controls.StatementNumber.value),
      'netAmount': this.StatementInfoGroup.controls.NetCheckAmount.value
    };
    postData['URL'] = 'DEUStatementClose';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      // this.dataEntryUnitSvc.islistFirstTimeLoad = true;
      this.showLoader = false;
      if (ResponseCode.SUCCESS === response.ResponseCode && response.result) {
        this.statementList.refreshHandler.next(true);
        const timeout = setInterval(() => {

          if (this.OnCheckStatementExist(this.StatementInfoGroup.controls.StatementNumber.value)) {
            clearInterval(timeout);
          }
        }, 500);
        this.toaster.success(`Statement closed successfully`);
        if (isNewStatemntCreate) {
          this.OnNewStatementCreate();
        }
      } else if (ResponseCode.SUCCESS === response.ResponseCode && !response.result) {
        this.toaster.error(`This statement can't be closed because check amount does not match the entered amount.`);
      }
    });
  }
  // #####################################################################################################################
  OnNewStatementCreate(): void {

    this.showLoader = true;
    if (this.StatementInfoGroup.controls.BatchNumber.value) {
      if (this.OnCheckBatchExist(this.StatementInfoGroup.controls.BatchNumber.value)) {
        const Userdetails = JSON.parse(localStorage.getItem('loggedUser'));
        const postData = {
          statement: {
            BatchId: this.StatementInfoGroup.controls.BatchId.value,
            PayorId: this.StatementInfoGroup.controls.PayorId.value,
            CreatedBy: Userdetails.UserCredentialID,
            TemplateID: this.StatementInfoGroup.controls.TemplateId.value ===
              Guid.createEmpty().toJSON().value ? null : this.StatementInfoGroup.controls.TemplateId.value,
          }
        };
        postData['URL'] = 'DEUAddUpdateStatement';
        this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
          if (ResponseCode.SUCCESS === response.ResponseCode) {
            const CreatedStatementNumber = response.IntResult;
            this.GetStatementList();
            const timeout = setInterval(() => {
              if (this.OnCheckStatementExist(CreatedStatementNumber)) {
                // this.dataEntryUnitSvc.islistFirstTimeLoad = true;
                clearInterval(timeout);
              }
            }, 500);
          }
        });
      } else {
        this.toaster.error('Please enter valid batch number');
        this.showLoader = false;
      }
    } else {
      this.toaster.error('Please enter batch number');
      this.showLoader = false;
    }
  }

  OnFindStatementNumber(): void {

    this.showLoader = true;
    const postData = {
      'statementNumber': this.StatementInfoGroup.controls.StatementNumber.value
    };
    postData['URL'] = 'DEUFindStatement';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      //   this.dataEntryUnitSvc.islistFirstTimeLoad = true;
      if (ResponseCode.SUCCESS === response.ResponseCode && response.Details) {
        this.StatementInfoGroup.controls.NetCheckAmount.setValue(response.Details.NetAmount.toFixed(2));
        this.selectedBatchIndex = 0;
        this.statementList.refreshHandler.next(true);
        this.OnCheckBatchExist(response.Details.BatchNumber);
        const timeout = setInterval(() => {
          if (this.OnCheckStatementExist(response.Details.StatementNumber)) {
            //  this.dataEntryUnitSvc.islistFirstTimeLoad = true;
            clearInterval(timeout);
          }

          this.showLoader = false;
        }, 500);
      } else {
        this.showLoader = false;
        this.toaster.error('Entered statement number not found');
      }
    });
  }
  /*
  CreatedBy:Acmeminds
  CreatedFor:Check is statement exist in list or not
  CreatedOn:25-04-2020 
  */
  OnCheckStatementExist(statementNumber: any): Boolean {
    // console.log('Inside OnCheckStatementExist');
    let isStatementFound: Boolean = false;
    if (this.statementList.miDataSource.getResponse && this.statementList.miDataSource.getResponse.TotalRecords) {

      this.statementList.miDataSource.getResponse.TotalRecords.forEach((details, index) => {

        if (details.StatementNumber == statementNumber) {
          this.selectedStatementIndex = index;
          isStatementFound = true;
        }

      });
    }
    return isStatementFound;
  }

  OnOpenStatement(): void {

    const postData = {
      'statementID': this.statementList.miDataSource.getResponse.TotalRecords[this.selectedStatementIndex]['StatementID']
    };
    postData['URL'] = 'DEUStatementOpen';
    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      if (ResponseCode.SUCCESS === response.ResponseCode && response.result) {
        //this.dataEntryUnitSvc.islistFirstTimeLoad = true;
        this.GetStatementList();
      }
    });
  }
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  /* 
    CreatedBy:Ankit Khandelwal
    CreatedOn:26-05-2020
    Purpose:Updating CheckAmount 
    */
  OnCheckAmtChange(fieldName: any): void {
    const checkAmntOriginalValue = this.OnConvertCrncyToNumberFormt(this.StatementInfoGroup.controls.CheckAmount.value);
    const checkAmntCnvrtedValue = this.OnConvertCurrencyFormat(this.StatementInfoGroup.controls.CheckAmount.value);
    let isSameCheckAmntStmntExist = false;

    if (!this.selectedStatmentRecord) {
      return;
    }
    if (checkAmntOriginalValue !== Number(this.selectedStatmentRecord.CheckAmount)) {
      const postData = {
        'batchId': this.StatementInfoGroup.controls.BatchId.value,
        'payorId': this.StatementInfoGroup.controls.PayorId.value,
        'checkAmount': checkAmntOriginalValue,
        'currentStatementId': this.StatementInfoGroup.controls.StatementId.value
      };
      postData['URL'] = 'GetStatementCheckAmountList';
      this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          isSameCheckAmntStmntExist = response.IsStatementFound;
          isSameCheckAmntStmntExist === true ?
            this.OnShowingCheckAmntExistDialog(fieldName, checkAmntOriginalValue) : this.OnUpdatingStatementFields(fieldName);
        } else {
          this.toaster.error('Error while updating checkAmount details.');

        }
      });
    } else {
      this.StatementInfoGroup.controls.CheckAmount.setValue(checkAmntCnvrtedValue);
    }
  }
  OnConvertCrncyToNumberFormt(number: any): any {
    let convertedNumber = number.replace(/,/g, '');
    convertedNumber = !isNaN(Number(convertedNumber)) ? Number(convertedNumber) : '0.00';
    return convertedNumber;
  }
  OnConvertCurrencyFormat(number: any): any {
    const newnumber = number ? number.toString().replace(/,/g, '') : '0.00';
    if (!isNaN(newnumber)) {
      return this.currencyFormat.transform(newnumber, 'USD', 'symbol', '1.2-2').replace('$', '');
    } else {
      return '0.00';
    }
  }

  OnShowingCheckAmntExistDialog(fieldName: any, checkAmntValue: any): void {
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Confirmation',
        subTitle: 'Check amount already appears in this batch for the same payor.Are you sure you want to change the amount?'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.OnUpdatingStatementFields(fieldName);
      } else {
        const convertedOldValue = this.OnConvertCurrencyFormat(this.selectedStatmentRecord.CheckAmount);
        this.StatementInfoGroup.controls.CheckAmount.setValue(convertedOldValue);
      }
    });
  }
  // ####################################################################################################################
  /*
  CreatedBy:Ankit Khandelwal
    CreatedFor:Updating Statement Fields details
    CreatedOn:26-05-2020
    */
  OnUpdatingStatementFields(fieldName: any): void {

    if (!this.selectedStatmentRecord) {
      return;
    }

    this.showLoader = true;
    const postData = {
      'statementId': this.StatementInfoGroup.controls.StatementId.value,
      'checkAmount': this.OnConvertCrncyToNumberFormt(this.StatementInfoGroup.controls.CheckAmount.value),
      'adjustment': this.OnConvertCrncyToNumberFormt(this.StatementInfoGroup.controls.BalForAdj.value),
      'statementDateString': this.commonMethodSvc.setDateFormat(this.StatementInfoGroup.controls.StatementDate.value)
    };
    postData['URL'] = 'UpdateCheckAmount';

    this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
      this.showLoader = false;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        // selected.CheckAmountString = this.StatementInfoGroup.controls.CheckAmount.value
        //  this.statementList.refreshHandler.next(true);
        const convertedCheckAmount = this.OnConvertCurrencyFormat(this.StatementInfoGroup.controls.CheckAmount.value);
        const convertBalAdjAmnt = this.OnConvertCurrencyFormat(this.StatementInfoGroup.controls.BalForAdj.value);
        this.StatementInfoGroup.controls.BalForAdj.setValue(convertBalAdjAmnt);
        this.StatementInfoGroup.controls.NetCheckAmount.setValue(response.netCheck);
        this.StatementInfoGroup.controls.CheckAmount.setValue(convertedCheckAmount);
        const selected = this.statementList.miDataSource.tableData.find(x => x.StatementID === this.selectedStatmentRecord.StatementID);
        if (selected) {
          selected.BalanceForOrAdjustment = this.OnConvertCrncyToNumberFormt(this.StatementInfoGroup.controls.BalForAdj.value);
          selected.NetAmountString = response.netCheck;
          selected.CheckAmount = this.OnConvertCrncyToNumberFormt(convertedCheckAmount);
          selected.CheckAmountString = '$' + convertedCheckAmount;
          selected.StatementDateString = this.StatementInfoGroup.controls.StatementDate.value;
          selected.CompletePercentageString = response.completePercent;
        }
        this.totalPercentage = response.completePercent;
        this.toaster.info(fieldName + ' updated successfully');
      } else {
        this.toaster.error('Error updating ' + fieldName + ': ' + 'Exception occurs while updating.');
      }
    });
  }
  // ##################################################################################################################
  OnUpdatingBalAdjField(): void {
    if (!this.selectedStatmentRecord) {
      return;
    }
    let blsForAdj = this.OnConvertCrncyToNumberFormt(this.StatementInfoGroup.controls.BalForAdj.value.replace(/,/g, ''));
    if (blsForAdj !== Number(this.selectedStatmentRecord.BalanceForOrAdjustment)) {
      this.OnUpdatingStatementFields('BalFor/Adj');
    } else {
      blsForAdj = this.OnConvertCurrencyFormat(blsForAdj);
      this.StatementInfoGroup.controls.BalForAdj.setValue(blsForAdj);
    }
  }
  /* 
  Modified:Ankit Khandelwal
  ModifiedOn:26-05-2020
  Purpose:function Name is not proper 
  */
  OnStatementDateChange(event: any): void {
    if (!this.selectedStatmentRecord) {
      return;
    }

    if (!new Date(this.lastStatementDate)) {

      // console.log('fsdf');
    }
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Confirmation',
        subTitle: 'Are you sure you want to change Date?'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.StatementInfoGroup.controls.StatementDate.setValue(this.lastStatementDate);
        this.OnUpdatingStatementFields('Statement Date');
      } else {
        this.lastStatementDate = this.StatementInfoGroup.controls.StatementDate.value;
      }
    });
  }
  // ################################################################################################################/
  OnGettingPaymentDetails(data: any): void {
    //  this.buttonText = data.DEUFieldDetails.isResetbuttonClick = !data.DEUFieldDetails.isResetbuttonClick ? 'End Edit' : 'Start Edit';
    
    if (data.DEUFieldDetails && data.DEUFieldDetails.policyUniqueIdentifier
      && data.DEUFieldDetails.policyUniqueIdentifier.length > 0) {
      this.searchPolicyParameters.next(data.DEUFieldDetails.policyUniqueIdentifier);
    } else if (data.DEUFieldDetails.isNewStatementCreate) {
      // this.dataEntryUnitSvc.islistFirstTimeLoad=true;
      // this.statementList.refreshHandler.next(true);
      // this.statementList.miDataSource.getResponse.TotalRecords
      this.StatementInfoGroup.controls.StatementNumber.setValue(data.DEUFieldDetails.newStatementNumber);
      this.isFindStatamentNumber = true;
      this.OnFindStatementNumber();
      this.OnResetSearchedPolicyGrid();
    } else {
      this.OnResetSearchedPolicyGrid();
    }

  }

  /*
  Author:Jyotisna
  Purpose: Method to update payments grid with posted entry details immediately after post
  */
  UpdatePaymentAfterPost(paymentDetails: any): void {


    let list = this.postedPaymentList.miDataSource.tableData;
    if (!paymentDetails.isNewEntry && !this.dataEntryUnitSvc.isErrorListDEUEntry) {


      if (paymentDetails.isSuccess) {
        const index = list.findIndex((obj => (obj && obj.DEUENtryID === paymentDetails.oldDEUEntryId)));
        list.splice(index, 1, paymentDetails.DEUFieldDetails);
      }
      else {
        const obj = list.find((obj => (obj && obj.DEUENtryID === paymentDetails.oldDEUEntryId)));
        if (obj) {
          obj.isSuccess = (paymentDetails.isPaidEntry) ? true : false;
          obj.isProcessing = false;
        }
      }

    } else {
      if (paymentDetails.isSuccess) {
        if (this.dataEntryUnitSvc.isErrorListDEUEntry) {
          this.OnGettingPostedPaymentList(false);
        } else {
          if (list.length >= this.dataEntryUnitSvc.paymentPageDetails.pageSize) {
            list.splice(list.length - 1, 1);
          }
          list = [paymentDetails.DEUFieldDetails].concat(list);
          this.postedPaymentList.miDataSource.getResponse.TotalLength = this.postedPaymentList.miDataSource.getResponse.TotalLength + 1;
        }
      }
    }
    const selected = this.statementList.miDataSource.tableData.find(x => x.StatementID === this.selectedStatmentRecord.StatementID);
    if (selected.PayorId !== this.StatementInfoGroup.controls.PayorId.value) {
      selected.PayorId = this.StatementInfoGroup.controls.PayorId.value;
      this.StatementInfoGroup.controls.OldPayorId.setValue(this.StatementInfoGroup.controls.PayorId.value);
    }
    if (selected.TemplateID !== this.StatementInfoGroup.controls.TemplateId.value) {
      selected.TemplateID = this.StatementInfoGroup.controls.TemplateId.value;
      this.StatementInfoGroup.controls.OldTemplateId.setValue(this.StatementInfoGroup.controls.TemplateId.value);
    }

    //  this.StatementInfoGroup.controls.PaymentEntriesCount.setValue(this.postedPaymentList.miDataSource.getResponse.EntriesCount + 1);
    this.postedPaymentList.cachedList = list;
    this.postedPaymentList.cachedListPageLength = this.postedPaymentList.miDataSource.getResponse.TotalLength;
    this.postedPaymentList.isClientSideListRefresh.next(true);
    this.OnResetSearchedPolicyGrid();
  }

  /*
   Author:Jyotisna
   Purpose: Method to update statement info grid with posted entry details
   and change payment color if error
   */
  UpdateStatementAfterPost(entered: any): void {

    // console.log('UpdateStatementAfterPost start');
    if (!this.dataEntryUnitSvc.isErrorListDEUEntry) {
      const entryList = this.postedPaymentList.miDataSource.tableData;
      if (!entered) {
        return;
      }
      const objPayment = entryList.find((obj => obj.DEUENtryID === entered.deuEntryId));
      if (objPayment) {
        objPayment.isProcessing = false;
        if (!entered) {
          return;
        }
        else {
          objPayment.isSuccess = entered.IsSuccess;
        }
      }
      // Mark selected entry red when not successful and add error count
    }
    if (entered && !entered.IsSuccess) {
      this.toaster.error('Error occurred while posting a payment');
    }
    this.StatementInfoGroup.controls.EnteredAmount.setValue(entered.EnteredAmount);
    const selected = this.statementList.miDataSource.tableData.find(x => x.StatementID === this.selectedStatmentRecord.StatementID);

    if (selected) {
      selected.StatusName = entered.StatementStatusName;
      selected.StatusId = entered.StatementStatusID;
      selected.EnteredAmount = entered.EnteredAmount;
      selected.EnteredAmountString = entered.EnteredAmount;
      selected.CompletePercentageString = entered.CompletePercent;
    }
    const batchList = this.batchList.miDataSource.tableData;
    const selectedBatch = batchList.find(x => x.BatchId === this.selectedRecord.BatchId);
    if (selectedBatch) {
      selectedBatch.EntryStatusString = entered.BatchStatusName;
      selectedBatch.EntryStatus = entered.BatchStatusID;
    }
    this.totalPercentage = entered.CompletePercent;
    this.errorCount = entered.ErrorCount;
    // console.log('UpdateStatementAfterPost complete');

    // this.OnErrorCount();
  }

  OnGettingPostedPaymentList(isFailedEntryList: boolean = false): void {

    this.showLoader = true;
    const postData = {
      'StatementId': this.StatementInfoGroup.controls.StatementId.value,
      'URL': !isFailedEntryList ? 'GetPostedPaymentsList' : 'GetDeuFailedPaymentsList'
    };
    this.dataEntryUnitSvc.isErrorListDEUEntry = isFailedEntryList;
    this.postedPaymentList.url = '/api/CommonData/CommTableListRequestSends';
    this.postedPaymentList.miDataSource = new TableDataSource(this.sendAPIRequest);
    this.postedPaymentList.columnLabels = ['Policy Number', 'Client', 'Premium', 'Comm %',
      'Invoice', 'Units', 'Fee', 'Share %', 'Total Payment', 'Date/Time', 'Carrier', 'Product'];

    this.postedPaymentList.displayedColumns = ['PolicyNumber', 'ClientName', 'PaymentReceived', 'CommissionPercentage',
      'InvoiceDate', 'Units', 'Fee', 'SplitPercentage', 'CommissionTotal', 'EntryDate', 'CarrierNickName', 'ProductName'];
    this.postedPaymentList.requestPostData = postData;
    this.postedPaymentList.resetPagingHandler = this.PageResetHandler;
    this.postedPaymentList.refreshHandler = this.postedPaymentListNeedRefresh;
    this.postedPaymentList.isClientSideListRefresh = this.isPaymetListRefresh;
    this.postedPaymentList.showPaging = true;
    this.postedPaymentList.refreshHandler.next(true);

    this.postedPaymentList.miDataSource.dataSubject.subscribe(isLoadingDone => {

      if (isLoadingDone && this.postedPaymentList.miDataSource.getResponse) {
        if (!this.dataEntryUnitSvc.isErrorListDEUEntry) {

          this.StatementInfoGroup.controls.PaymentEntriesCount.setValue(this.postedPaymentList.miDataSource.getResponse.TotalLength);
        }
        if (!this.dataEntryUnitSvc.isPaymentListRefresh) {
          this.dataEntryUnitSvc.isPaymentListRefresh = true;
        }
        this.postedPaymentList.cachedList = null;
        this.isPaymentListRefresh.next(true);
        // this.OnErrorCount();
        this.errorCount = this.postedPaymentList.miDataSource.getResponse.ErrorCount;
        this.showLoader = false;
      }
    });
    if (isFailedEntryList) {
      this.dataEntryUnitSvc.buttonText = 'End Edit';
      this.OnClickStartEdit();
    }
  }
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  /* 
  Createby:Ankit khandelwal
  CreatedOn:28-05-2020
  Purpose:End Edit/Start Edit text change 
  */
  OnPaymentSelectionChange(SelectedRecords: any): void {

    this.postedPaymentIndex = SelectedRecords.index;
    this.lastPaymentRecord = SelectedRecords.data;

    if (SelectedRecords.actionName === 'row-click') {
      this.dataEntryUnitSvc.buttonText = 'End Edit';
      this.OnClickStartEdit();
    }
  }
  OnClickStartEdit(): void {

    const data = {
      'selectedPaymentDetails': this.lastPaymentRecord,
    };
    this.dataEntryUnitSvc.buttonText = this.dataEntryUnitSvc.buttonText === 'Start Edit' ? 'End Edit' : 'Start Edit';
    this.isSelectedPaymentDetails.next(data);
  }


  // ##################################################################################################################
  /* 
  Createby:Jasmine dame
  CreatedOn:26-05-2020
  Purpose:Delete selected Payment 
  */
  OnDeleteSelectedPayment(): void {
    const dilogref = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Payment Entry',
        subTitle: 'Are you sure you want to delete selected payment entry?',
        primaryButton: 'Yes, Delete'
      },
      width: '400px'
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        const list = this.postedPaymentList.miDataSource.tableData;
        // Remove and insert existing entry on edit at same place and refresh grid 
        const userDetails = JSON.parse(localStorage.getItem('loggedUser'));
        const deuObject: DEUFormField = new DEUFormField();
        deuObject.DeuEntryId = this.lastPaymentRecord.DEUENtryID;
        deuObject.DeuEntryIdField = this.lastPaymentRecord.DEUENtryID;
        deuObject.CurrentUser = userDetails.UserCredentialID;
        deuObject.CurrentUserField = userDetails.UserCredentialID;
        // Reste entry section, in case someone clicked "Start edit" befoe delete
        if (this.dataEntryUnitSvc.buttonText === 'End Edit') {
          this.OnClickStartEdit();
        }
        this.OnResetSearchedPolicyGrid();
        const postData = {
          '_PostEntryProcess': 3,
          'deuFields': deuObject,
          deuEntryId: this.lastPaymentRecord.DEUENtryID,
          URL: 'ProcessPaymentEntry'
        };
        this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
          if (ResponseCode.SUCCESS === response.ResponseCode) {
            this.OnDeletePaymentEntryFromList(response, list);
          } else {
            this.showLoader = false;
            this.toaster.error(response.ExceptionMessage);
          }

        });


      }
    });
  }
  OnDeletePaymentEntryFromList(response: any, list: any): void {

    this.showLoader = false;
    if (response.PostStatus) {
      if (this.dataEntryUnitSvc.paymentPageDetails.nextIndex == 0) {
        if (!this.dataEntryUnitSvc.isErrorListDEUEntry) {
          if (this.postedPaymentList.miDataSource.getResponse.TotalLength < this.dataEntryUnitSvc.paymentPageDetails.pageSize) {
            const index = list.findIndex((obj => obj.DEUENtryID === this.lastPaymentRecord.DEUENtryID));
            list.splice(index, 1);
            this.postedPaymentList.cachedList = list;

            this.postedPaymentList.miDataSource.getResponse.TotalLength =
              this.postedPaymentList.miDataSource.getResponse.TotalLength - 1;

            this.UpdateStatementAfterPost(response.PostStatus);
            this.StatementInfoGroup.controls.PaymentEntriesCount.setValue(this.postedPaymentList.miDataSource.getResponse.EntriesCount);
            this.errorCount = this.postedPaymentList.miDataSource.getResponse.ErrorCount;
            this.postedPaymentList.cachedListPageLength = this.postedPaymentList.miDataSource.getResponse.TotalLength;
            this.postedPaymentList.isClientSideListRefresh.next(true);
          } else {
            this.postedPaymentList.refreshHandler.next(true);
          }
        } else {
          this.postedPaymentList.refreshHandler.next(true);
        }
      } else {
        if (list.length === 1) {
          this.postedPaymentList.resetPagingHandler.next(true);
        }
        this.postedPaymentList.refreshHandler.next(true);
      }
      this.toaster.success('Selected entry deleted successfully.');
    }


  }
  // ###########################################################################################################

  PolicyLearnedFields(searchPolicyList: any): void {
    this.policyLearnedFields.next(searchPolicyList);
  }
  // calculatePercentage(): void {
  //   const result = (this.StatementInfoGroup.controls.EnteredAmount.value /
  //     (this.StatementInfoGroup.controls.NetCheckAmount.value -
  //       this.StatementInfoGroup.controls.BalForAdj.value) * 100);
  //   this.totalPercentage = result.toFixed(2);
  // }
  // #################################################################################################
  OnPageChange(): void {
    if (!this.selectedStatmentRecord) {
      return;
    }
    if (this.StatementInfoGroup.controls.Pages.value) {
      this.selectedStatmentRecord.FromPage = '';
      this.selectedStatmentRecord.ToPage = '';
      const splitValue = this.StatementInfoGroup.controls.Pages.value.split('-');
      if (splitValue.length > 0) {

        if (splitValue.length === 2) {
          if ((splitValue[0] > 0 && splitValue[0] < 1000) && (splitValue[1] > 0 && splitValue[1] < 1000)) {
            this.selectedStatmentRecord.FromPage = splitValue[0];
            this.selectedStatmentRecord.ToPage = splitValue[1];
          }
        } else if (splitValue.length === 1) {
          if (splitValue[0] > 0 && splitValue[0] < 1000) {
            this.selectedStatmentRecord.FromPage = splitValue[0];
            this.selectedStatmentRecord.ToPage = splitValue[0];
          }
        }
        const postData = {
          'statementId': this.selectedStatmentRecord.StatementID,
          'fromPage': this.selectedStatmentRecord.FromPage,
          'toPage': this.selectedStatmentRecord.ToPage,
          URL: 'UpdateStatementPages'
        };

        this.sendAPIRequest.RequestSendsToAPI(postData).subscribe(response => {
          const mainList = this.statementList.miDataSource.tableData;
          const selected = mainList.find(x => x.StatementID === this.selectedStatmentRecord.StatementID);
          if (selected) {
            selected.FromPage = this.selectedStatmentRecord.FromPage;
            selected.ToPage = this.selectedStatmentRecord.ToPage;
          }
        });

      }
    }
  }
  ngOnDestroy(): void {
    this.appDataSvc.isHeaderShown = true;
    this.OnResetServiceVariables();

  }
  OnScrollingInList(scrolling: any): void {
    if (this.matTabIndex === 0) {
      this.scrollingBatchCoordinate = scrolling.scrollingCoordinate;
    }
    if (this.matTabIndex === 1) {
      this.scrollingStatementCoordinate = scrolling.scrollingCoordinate;
    }
  }
  onTabChanged(event: any): void {
    this.matTabIndex = event.index;
    const coordinates = event.index === 1 ? this.scrollingStatementCoordinate : this.scrollingBatchCoordinate;
    
    this.onFixedDivScroll.next(coordinates);
  }

  // OnErrorCount(): void {
  //   // this.postedPaymentList.miDataSource.tableData.forEach(item => {
  //   //   if (item && !item.isSuccess) {
  //   //     this.errorCount = this.errorCount + 1;
  //   //   }

  //   // });
  //   
  //   this.errorCount = this.postedPaymentList.miDataSource.tableData.filter(item => (item && !item.isSuccess)).length;

  // }
  OnSelectedFirstPageIndex(pageDetails: any): void {
    this.pageDetails = pageDetails.pageIndex;
    this.isPageReset.next(true);
    this.postedPaymentList.refreshHandler.next(true);
    // this.dataEntryUnitSvc.islistFirstTimeLoad = true;
  }
  OnResetServiceVariables(): void {
    this.dataEntryUnitSvc.postedEntryObject = '';
    this.dataEntryUnitSvc.buttonText = 'Start Edit';
    this.dataEntryUnitSvc.isErrorListDEUEntry = false;
    if (this.postedPaymentList.resetPagingHandler) {
      this.postedPaymentList.resetPagingHandler.next(true);
    }
  }
  OnChangeStartEditText(): void {

    this.dataEntryUnitSvc.buttonText = 'End Edit';
    this.OnClickStartEdit();
  }
  OnPostNewDataEntry(): void {
    this.UpdatePaymentAfterPost(this.dataEntryUnitSvc.postedEntryObject);
  }

}