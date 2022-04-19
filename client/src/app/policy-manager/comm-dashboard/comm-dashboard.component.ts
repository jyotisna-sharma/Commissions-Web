import { Component, OnInit, ViewChild } from '@angular/core';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute, Router, } from '@angular/router';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { PolicymanagerService } from '../policymanager.service';
import { CommonDataService } from '../../_services/common-data.service'
import { PolicyManagerUrlService } from '../policy-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from 'src/app/_services/table.datasource';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { CommissionDashboardPaymentsComponent } from '../../_services/dialogboxes/commission-dashboard-incomingPayments/commission-dashboard-incomingPayments.component';
import { ResponseCode } from 'src/app/response.code';
// tslint:disable-next-line:max-line-length
import { CommissionDashboardReversePaymentComponent } from '../../_services/dialogboxes/commission-dashboard-reverse-payment/commission-dashboard-reverse-payment.component';
import { Guid } from 'guid-typescript';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { ResponseErrorService } from '../../_services/response-error.service';
import { MultiplesColumns } from '../../shared/commission-dashboard-list/multiples-columns';
import { MultipleColumLabels } from '../../shared/commission-dashboard-list/Commission-dahboard-multiple-ColumnLabel';
import { ServerURLS } from '../../../assets/config/CONSTANTS';
import { ExportExcelService } from './../../_services/export-excel.service';

@Component({
  selector: 'app-comm-dashboard',
  templateUrl: './comm-dashboard.component.html',
  styleUrls: ['./comm-dashboard.component.scss']
})
export class CommDashboardComponent implements OnInit {
  isTabDisable: Boolean = false;
  pagename: any;
  moduleName: any;
  miIncomingPaymentList: MiProperties = new MiProperties();
  miOutgoingPaymentList: MiProperties = new MiProperties();
  incomingNeedRefresh: Subject<boolean> = new Subject();
  outgoingNeedRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  clientList: any;
  clientName: any;
  userdetails: any;
  userList: any;
  policyNumber: any;
  postdata: any;
  showCount: any;
  searchData: any;
  validationErrorObject: {};
  policyData: any;
  firstRecordData: any;
  lastSelectedClass: any;
  lastSelectedRecord: any;
  isOutgoingValidationShown: Boolean = false;
  isgettingOutgoingList: Boolean = false;
  searchList: Subject<boolean> = new Subject();
  OutgoingPaymentlistData: any;
  outgoingValidationMessage: any;
  isOutgoingdivShown: Boolean = false;
  showloading: Boolean = false;
  ispolicyDataShown: Boolean = false;
  isButtonShown: Boolean = false;
  isUserHavePermission: Boolean = true;
  isButtonDisabled: Boolean = true;
  matToolTiptext: any;
  islistfirsttimeload: Boolean = false;
  defaultSlctnCount: any = 0;
  incomingSelectedRowData: any;
  incomingPayColumnLabel = ['', 'Invoice Date', 'Amount', 'Incoming',
    'Number', '$ Per', 'Fee',
    'Share %', 'Total Amount', 'Batch/Stmnt',
    'Statement Date', 'Page #s', ''];

  incomingPayColumnType = [['InvoiceDateString', 'date'],
  ['PaymentRecived', 'currency'],
  ['CommissionPercentage', 'percentage'],
  ['NumberOfUnits', 'number'],
  ['DollerPerUnit', 'currency'],
  ['Fee', 'currency'],
  ['SplitPer', 'percentage'],
  ['TotalPayment', 'currency'],
  ['BatchNumber', 'distinct'],
  ['StatementDateString', 'date'],
  ['Pageno', 'string']
  ];

  incomingPayDisplayColumn = ['SelectData', 'InvoiceDateString', 'PaymentRecived',
    'CommissionPercentage', 'NumberOfUnits', 'DollerPerUnit',
    'Fee', 'SplitPer', 'TotalPayment',
    'BatchNumber', 'StatementDateString', 'Pageno',
    'Action'];
  outgoingPayColumnLabel = ['Payee', 'Premium', 'Payment', 'Outgoing $ Per Unit',
    'Total Due to Payee', 'Status', ''];
  outgoingPayDisplayColumn = ['PayeeName', 'OutgoingPremium', 'Payment',
    'OutGoingPerUnit', 'PaidAmount', 'Status',
    'Action'];
  outgoingPayColumnType = [['PayeeName', 'string'],
  ['Premium', 'percentage'],
  ['Payment', 'percentage'],
  ['OutGoingPerUnit', 'currency'],
  ['PaidAmount', 'currency'],
  ['Status', 'string']
  ];
  filter: FormGroup;
  statusFilters = [
    {
      key: 1, value: 'Paid',
    },
    {
      key: 2, value: 'Unpaid',
    }
  ];
  @ViewChild('allSelected',{ static: true }) public allSelected: MatOption;
  constructor(
    public getRouteParamtersService: GetRouteParamtersService,
    public activateRoute: ActivatedRoute,
    public policyManagerUrl: PolicyManagerUrlService,
    public policyService: PolicymanagerService,
    public dialog: MatDialog,
    public router: Router,
    public responseError: ResponseErrorService,
    public commonService: CommonDataService,
    public excelService: ExportExcelService
  ) { }

  ngOnInit() {
    this.getRouteParamtersService.getparameterslist(this.activateRoute);
    this.pagename = 'Edit policy';
    this.moduleName = this.router.url.indexOf('advance-Search') > -1 ? 'Policy Manager - Advance Search' : 'Policy manager';
   // this.clientList = JSON.parse(localStorage.getItem('ClientList'));
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.policyNumber = localStorage.getItem('PolicyNumber');
    // for (const ClientData of this.clientList) {
    //   if (ClientData.ClientId === this.getRouteParamtersService.ClientId) {
    //     this.clientName = ClientData.Name;
    //   }
    // }
    this.getPolicyDetails();
    this.GetIncomingPaymentList();
    this.IncomingPaymentListingPrmtrs();
  }
  getPolicyDetails() {
    this.postdata = {
      'policyId': this.getRouteParamtersService.PolicyId,
      'licenseeId': this.userdetails['LicenseeId'],
      'clientId': this.getRouteParamtersService.ClientId
    }
    this.policyService.getPolicyDetails(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.policyData = response.PolicyObject;
        if (!this.policyData.PayorId || !this.policyData.CarrierID || !this.policyData.CoverageId) {
          this.isButtonDisabled = false;
          this.matToolTiptext = 'Payment cannot be entered as the policy has missing payor, carrier or coverage information. '
        } else {
          this.isButtonDisabled = true;
          this.isButtonShown = true;
        }
        if (this.userdetails.Permissions[1].Permission === 1) {
          this.isUserHavePermission = false;
          this.isButtonDisabled = true;
          this.isButtonShown = true;
          this.matToolTiptext = 'This action is disabled as it requires' + ' ' + 'Write' + ' ' + 'access for this module.'
        }
      } else {
        const Message = response.message;
        this.responseError.OpenResponseErrorDilog(Message);
      }
      this.ispolicyDataShown = true;
    });
  }

  // ------This method is used for Add new Incoming Payment-----
  // AddNewIncomingPayment() {
  //   if (this.policyData) {
  //     const dialogRef = this.dialog.open(CommissionDashboardPaymentsComponent, {
  //       data: {
  //         headingTitle: 'Add Incoming Payment',
  //         subTitle: '',
  //         primaryButton: 'Post',
  //         secondryButton: 'Cancel',
  //         extraData: {
  //           'policyData': this.policyData
  //         }

  //       },
  //       disableClose: true,
  //       width: '400px',
  //     });
  //     dialogRef.afterClosed().subscribe((result) => {
  //       if (result) {

  //         this.showloading = true;
  //         this.postdata = {
  //           'SelectedPolicy': {
  //             'PayorId': this.policyData.PayorId,
  //             'PolicyLicenseeId': this.policyData.PolicyLicenseeId,
  //             'PolicyId': this.policyData.PolicyId
  //           },
  //           'PaymentEntry': {
  //             'PaymentEntryID': Guid.create().toJSON().value,
  //             'PolicyID': this.getRouteParamtersService.PolicyId,
  //             'InvoiceDateString': this.OnSaveDateFormat(new Date(result.InvoiceDate.value)),
  //             'PaymentRecived': result.PaymentReceived.value ? result.PaymentReceived.value : 0.00,
  //             'CommissionPercentage': result.CommissionPer.value ? result.CommissionPer.value : 0.00,
  //             'NumberOfUnits': result.NumberOfUnits.value ? result.NumberOfUnits.value : 0.00,
  //             'DollerPerUnit': result.DollarPerUnit.value ? result.DollarPerUnit.value : 0.00,
  //             'Fee': result.Fee.value ? result.Fee.value : 0.00,
  //             'SplitPer': result.SplitPer.value ? result.SplitPer.value : 100,
  //             'TotalPayment': result.TotalPayment.value.replace('$', ''),
  //             'CreatedOnString': this.OnSaveDateFormat(new Date()),
  //             'CreatedBy': this.userdetails['UserCredentialID'],
  //             'PostStatusID': null,
  //             'ClientId': this.getRouteParamtersService.ClientId,
  //             'Bonus': 0,
  //             'DEUEntryId': Guid.createEmpty().toJSON().value,
  //           },
  //           '_PostEntryProcess': 1,
  //           '_UserRole': this.userdetails['Role'],
  //           'isInvoiceEdited': false
  //         }
  //         this.policyService.AddUpdateIncomingPayment(this.postdata).subscribe(getresponse => {
  //           if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
  //             this.defaultSlctnCount = 0;
  //             this.showloading = false;
  //             this.isOutgoingdivShown = false;
  //             this.islistfirsttimeload = false;
  //             this.GetIncomingPaymentList();
  //             this.IncomingPaymentListingPrmtrs();
  //           } else {
  //             const Message = getresponse.message;
  //             this.responseError.OpenResponseErrorDilog(Message);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }
  OnSaveDateFormat = (dateObj: Date): string => {
    if (dateObj) {
      return ((dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()) || '');
    }
  }
  GetIncomingPaymentList() {
    const url = this.policyManagerUrl.PolicyDetails.GetImcomingPaymentList;
    this.miIncomingPaymentList.url = url;
    this.miIncomingPaymentList.miDataSource = new TableDataSource(this.policyService);
    this.miIncomingPaymentList.columnLabels = this.incomingPayColumnLabel;
    this.miIncomingPaymentList.columnDataTypes = this.incomingPayColumnType;
    this.miIncomingPaymentList.displayedColumns = this.incomingPayDisplayColumn;
    this.miIncomingPaymentList.columnIsSortable = ['false', 'true', 'true', 'true', 'true', 'true', 'true', 'true',
      'true', 'true', 'true', 'true', 'false'];
    this.miIncomingPaymentList.refreshHandler = this.incomingNeedRefresh;
    this.miIncomingPaymentList.showPaging = true;
    this.miIncomingPaymentList.resetPagingHandler = this.needPageReset;
    this.miIncomingPaymentList.pageSize = this.getRouteParamtersService.pageSize
    this.miIncomingPaymentList.initialPageIndex = this.getRouteParamtersService.pageIndex;
    this.miIncomingPaymentList.miListMenu = new MiListMenu();
    this.miIncomingPaymentList.miListMenu.visibleOnDesk = true;
    this.miIncomingPaymentList.miListMenu.visibleOnMob = false;
    this.miIncomingPaymentList.isClientSideList = true;
    this.miIncomingPaymentList.showPaging = false;
    this.miIncomingPaymentList.isEditablegrid = false;
    this.miIncomingPaymentList.isMultipleColumnShown = true;
    this.miIncomingPaymentList.multipleColumHeader = new MultipleColumLabels();
    this.miIncomingPaymentList.multipleColumHeader.multiplecolumnLabels = ['hidden', 'Premium', 'Unit', 'hide'];
    this.miIncomingPaymentList.fieldType = {
      'SelectData': new MiListFieldType('', 'SelectData', '', '',
        'radio-button', '', '', true, this.DefaultSelectedFirstRecord, '', '', this),
    }
    this.miIncomingPaymentList.multipleColumHeader.multipleColumType = {
      'hidden': new MultiplesColumns('', '', '', 'hidden', 2),
      'Premium': new MultiplesColumns('Premium', 'Premium', '', '', 2),
      'Unit': new MultiplesColumns('Unit', 'Premium', '', '', 3),
      'hide': new MultiplesColumns('', '', '', 'hidden', 7),
    }
    this.miIncomingPaymentList.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 3, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('View File', 3, true, false, null, 'img-icons view-icn'),
        new MiListMenuItem('UnLink', 3, true, true, this.IslinkedDisabled, 'img-icons unlink-icn'),
        new MiListMenuItem('Delete', 3, true, true, this.IslinkedDisabled, 'img-icons delete-icn')
      ];
    this.miIncomingPaymentList.miDataSource.dataSubject.subscribe(isloadingdone => {
      if (isloadingdone && isloadingdone.length > 0) {
        if (!this.islistfirsttimeload) {
          this.showloading = true;
          this.islistfirsttimeload = true;
        }
      }

    });
  }
  DefaultSelectedFirstRecord(value, element, index, fieldValues) {
    if (index === 0 && fieldValues.thisRef.defaultSlctnCount === 0) {
      this.firstRecordData = {
        'data': value
      };
      fieldValues.thisRef.defaultSlctnCount++;
      fieldValues.thisRef.isOutgoingdivShown = true;
      this.showloading = true;
      fieldValues.isfunctionRequired = false;
      fieldValues.thisRef.incomingSelectedRowData = value;
      fieldValues.thisRef.lastSelectedRecord = value;
      fieldValues.thisRef.OnOutgoingPaymentList();
      fieldValues.thisRef.OutgoingPaymentListPrmtrs(this.firstRecordData);
      return value.Checked = true;
    } else if (index === 0) {
      return value.Checked = true;
    }
  }

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

  IslinkedDisabled(element) {
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    return (this.userdetails.Permissions[1].Permission === 1) === true ? true : false;
  }

  IncomingPaymentListingPrmtrs() {
    this.postdata = {
      'policyId': this.getRouteParamtersService.PolicyId
    }
    this.miIncomingPaymentList.requestPostData = this.postdata;
    this.miIncomingPaymentList.refreshHandler.next(true);
  }
  OnReversePayment(rowData) {
    this.postdata = {
      'licenseeId': this.userdetails['LicenseeId'],
      'roleIdToView': 3
    }
    this.showloading = true;
    this.policyService.GetLicenseeUserList(this.postdata).subscribe(response => {
      this.showloading = false;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.userList = response.UsersList;
        const dialogRef = this.dialog.open(CommissionDashboardReversePaymentComponent, {
          data: {
            headingTitle: 'Add Incoming payment',
            subTitle: '',
            primaryButton: 'Post',
            secondryButton: 'Cancel',
            extraData: {
              'userList': this.userList,
              'rowData': rowData
            }
          },
          disableClose: true,
          width: '400px',
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result && result !== 'false') {
            this.showloading = true;
            const remainingAmount = (result.CommissionPaid.value * result.ReverseFromAgent.value / 100)
            this.postdata = {
              'OldPolicyOutgoingDistribution': {
                'CreatedDateString': this.OnSaveDateFormat(new Date()),
                'IsPaid': false,
                'OutgoingPaymentId': Guid.create().toJSON().value,
                'PaidAmount': (-1) * remainingAmount,
                'PaymentEntryId': rowData.PaymentEntryId,
                'RecipientUserCredentialId': rowData.RecipientUserCredentialId
              },
              'NewPolicyOutgoingDistribution': {
                'CreatedDateString': this.OnSaveDateFormat(new Date()),
                'IsPaid': false,
                'OutgoingPaymentId': Guid.create().toJSON().value,
                'PaidAmount': remainingAmount,
                'PaymentEntryId': rowData.PaymentEntryId,
                'RecipientUserCredentialId': result.UserName.value
              }
            };
            this.policyService.ReverseOutgoingPayment(this.postdata).subscribe(getresponse => {
              if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
                if (this.incomingSelectedRowData) {
                  const batchNumber = this.incomingSelectedRowData.BatchNumber.split('/');
                  this.postdata = {
                    'batchNumber': batchNumber[0]
                  };
                  this.policyService.BatchStatusUpdate(this.postdata).subscribe(Statusresponse => {
                    if (Statusresponse.ResponseCode === ResponseCode.SUCCESS) {
                      this.miOutgoingPaymentList.refreshHandler.next(true);
                    } else {
                      this.responseError.OpenResponseErrorDilog(getresponse.message);
                    }
                  });
                  this.showloading = false;
                  this.miOutgoingPaymentList.refreshHandler.next(true);
                } else {
                  this.responseError.OpenResponseErrorDilog('Error occured while reverse payment to agent.');
                  this.showloading = false;
                }
              }
            });
          }
        });
      }
    });

  }
  OnIncomingMenuItemClicked(value) {
    if (this.lastSelectedClass) {
      this.lastSelectedClass.removeClass('highlighted-row');
    }
    if (value.name === 'radio-button') {
      if (this.lastSelectedRecord) {

        this.lastSelectedRecord.Checked = false;
        this.lastSelectedRecord.firstrow = false;
      }
      value.data.Checked = true;
      this.lastSelectedRecord = value.data;
      value.event.isfunctionRequired = false;
      this.isOutgoingValidationShown = false;
      this.isOutgoingdivShown = true;
      this.incomingSelectedRowData = value.data;
      this.validationErrorObject = {};
      $(value.events.currentTarget).closest('.mat-row').addClass('highlighted-row');
      this.lastSelectedClass = $(value.events.currentTarget).closest('.mat-row');
      this.OnOutgoingPaymentList();
      this.OutgoingPaymentListPrmtrs(value);
    } else if (value.name === 'Edit') {
      this.isOutgoingValidationShown = false;
      if (!this.policyData.PayorId || !this.policyData.CarrierID || !this.policyData.CoverageId) {
        const dialogRef = this.dialog.open(SuccessMessageComponent, {
          data: {
            Title: 'Editing Not Allowed' + '' + '!',
            subTitle: 'Payment cannot be edited as the policy has missing payor, carrier or coverage information. ',
            buttonName: 'ok',
            isCommanFunction: false
          },
          width: '400px',
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
      } else {
        const dataToSend = {
          'IsEntrybyCommissiondashBoard': value.data.IsEntrybyCommissiondashBoard,
          'PaymentDetails': value.data
        };
        this.OnEditIncomingPayment(dataToSend);
      }
    } else if (value.name === 'Delete') {
      this.isOutgoingValidationShown = false;
      if (value.data.IsEntrybyCommissiondashBoard === true) {
        this.openIncomingDeleteDialogBox(value);
      } else {
        this.OpenIncomingDeuEntryDeleteDialogBox();
      }
    } else if (value.name === 'UnLink') {
      this.OnUnLikIncomingPayment(value)
    } else if (value.name === 'View File') {
      this.ViewFile(value.data);
    }

  }
  OpenNonEditingDilogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Editing Not Allowed' + '' + '!',
        subTitle: 'Please note that this payment entry cannot be Edited, as it is entered from DEU. ',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {

      }
    });

  }
  OnEditIncomingPayment(data) {
    this.postdata = {
      'policyId': this.getRouteParamtersService.PolicyId,
      'licenseeId': this.userdetails['LicenseeId'],
      'clientId': this.getRouteParamtersService.ClientId
    }
    this.policyService.getPolicyDetails(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.policyData = response.PolicyObject;

        if (this.policyData) {
          const dialogRef = this.dialog.open(CommissionDashboardPaymentsComponent, {
            data: {
              headingTitle: 'Edit Incoming Payment',
              subTitle: '',
              primaryButton: 'Post',
              secondryButton: 'Cancel',
              extraData: {
                'policyData': this.policyData,
                'CheckpolicyDetails': data
              }
            },
            disableClose: true,
            width: '400px',
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.showloading = true;
              this.postdata = {
                'SelectedPolicy': {
                  'PayorId': this.policyData.PayorId,
                  'PolicyLicenseeId': this.policyData.PolicyLicenseeId,
                  'PolicyId': this.policyData.PolicyId
                },
                'PaymentEntry': {
                  'PaymentEntryID': result.PaymentEntryID.value,
                  'PolicyID': this.getRouteParamtersService.PolicyId,
                  'InvoiceDateString': this.OnSaveDateFormat(new Date(result.InvoiceDate.value)),
                  'PaymentRecived': result.PaymentReceived.value ? result.PaymentReceived.value : 0.00,
                  'CommissionPercentage': result.CommissionPer.value ? result.CommissionPer.value : 0.00,
                  'NumberOfUnits': result.NumberOfUnits.value ? result.NumberOfUnits.value : 0.00,
                  'DollerPerUnit': result.DollarPerUnit.value ? result.DollarPerUnit.value : 0.00,
                  'Fee': result.Fee.value ? result.Fee.value : 0.00,
                  'SplitPer': result.SplitPer.value ? result.SplitPer.value : 100,
                  'TotalPayment': result.TotalPayment.value.replace('$', ''),
                  'CreatedOnString': this.OnSaveDateFormat(new Date()),
                  'CreatedBy': this.userdetails['UserCredentialID'],
                  'PostStatusID': null,
                  'ClientId': this.getRouteParamtersService.ClientId,
                  'Bonus': 0,
                  'DEUEntryId': result.DEUEntryId.value,
                  'StmtID': data.PaymentDetails.StatementId
                },
                '_PostEntryProcess': 2,
                '_UserRole': this.userdetails['Role'],
                'isInvoiceEdited': !data.IsEntrybyCommissiondashBoard ? true : false
              }
              this.policyService.AddUpdateIncomingPayment(this.postdata).subscribe(getresponse => {
                if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
                  this.isOutgoingdivShown = false;
                  this.defaultSlctnCount = 0;
                  this.islistfirsttimeload = false;
                  this.GetIncomingPaymentList();
                  this.IncomingPaymentListingPrmtrs();
                } else {
                  const Message = response.message;
                  this.responseError.OpenResponseErrorDilog(Message);
                }
                this.showloading = false;
              });
            }
          });
        }
      } else {
        return;
      }
    });

  }
  // --------------------------------------------------UnLinking a payment Entry-------------------------------------------
  OnUnLikIncomingPayment(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Unlink Payment',
        subTitle: ' Are you sure you want to unlink this payment entry?',
        primaryButton: 'Yes, Unlink'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'false') {
        this.showloading = true;
        this.postdata = {
          'PaymentEntry': {
            'DEUEntryId': value.data.DEUEntryId,
            'PaymentEntryID': value.data.PaymentEntryID
          },
          'userRole': this.userdetails['Role']
        };
        this.policyService.UnLinkIncomingPayment(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.isOutgoingdivShown = false;
            this.defaultSlctnCount = 0;
            this.islistfirsttimeload = false;
            this.GetIncomingPaymentList();
            this.IncomingPaymentListingPrmtrs();
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
          this.showloading = false;
        });
      }
    });
  }
  // #########################################################################################################################
  OnOutgoingMenuItemClicked(value) {
    if (value.name === 'Delete') {
      this.openOutgoingDeleteDialogBox(value);
    } else if (value.name === 'Reverse') {
      this.OnReversePayment(value.data);
    }
  }
  // -------------------------------------This  is used for delete data entry --------------------------------------------------------------
  openIncomingDeleteDialogBox(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Payment',
        subTitle: ' Are you sure you want to delete selected payment?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'false') {
        this.showloading = true;
        this.postdata = {
          'PaymentEntry': {
            'DEUEntryId': value.data.DEUEntryId
          },
          'userRole': this.userdetails['Role']
        }
        this.policyService.RemoveIncomingPayment(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.isOutgoingdivShown = false;
            this.islistfirsttimeload = false;
            this.defaultSlctnCount = 0;
            this.GetIncomingPaymentList();
            this.IncomingPaymentListingPrmtrs();
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
          this.showloading = false;
        });
      }
    });
  }
  // ##############################################################################################################################
  openOutgoingDeleteDialogBox(value) {
    if (value.data.IsEntrybyCommissiondashBoard === false) {
      const dialogRef = this.dialog.open(SuccessMessageComponent, {
        data: {
          Title: 'Deletion Not Allowed' + '' + '!',
          subTitle: 'Please note that this payment entry cannot be deleted, as it is entered from DEU. ',
          buttonName: 'ok',
          isCommanFunction: false
        },
        width: '400px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
      });
    } else {
      const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
        data: {
          headingTitle: 'Delete Outgoing Payment',
          subTitle: ' Are you sure you want to delete selected outgoing payment entry?',
          primaryButton: 'Yes, Delete'
        },
        width: '450px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result !== 'false') {
          this.showloading = true;
          this.postdata = {
            'outgoingPaymentId': value.data.OutgoingPaymentId
          }
          this.policyService.RemoveOutgoingPayment(this.postdata).subscribe(response => {
            if (response.ResponseCode === ResponseCode.SUCCESS) {
              this.miOutgoingPaymentList.refreshHandler.next(true);
            } else {
              this.responseError.OpenResponseErrorDilog(response.Message);
            }
            this.showloading = false;
          });
        }
      });
    }
  }
  // -----------------------------This method is used for showing a popup when user delete data entry that comes from DEU -----------------
  OpenIncomingDeuEntryDeleteDialogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Deletion Not Allowed' + '' + '!',
        subTitle: 'Please note that this payment entry cannot be deleted, as it is entered from DEU. ',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  // ##############################################################################################################################
  // OnSelectAllStatusFilter() {
  //   if (this.allSelected.selected) {
  //     this.filter.controls.filterType.patchValue([...this.statusFilters.map(item => item.key), 0]);
  //     this.miOutgoingPaymentList.cachedList = this.OutgoingPaymentlistData;
  //     this.miOutgoingPaymentList.clientSideSearch.next(true);
  //   } else {
  //     this.filter.controls.filterType.patchValue([]);
  //     this.miOutgoingPaymentList.cachedList = [];
  //     this.miOutgoingPaymentList.clientSideSearch.next(true);

  //   }
  // }
  // OnStatusFilter(value) {
  //   if (this.allSelected.selected) {
  //     this.allSelected.deselect();
  //   }
  //   if (this.filter.controls.filterType.value.length === this.statusFilters.length) {
  //     this.allSelected.select();
  //   }
  //   for (const filter of this.filter.controls.filterType.value) {
  //     this.searchData = filter === 2 ? 'Unpaid' : filter === 1 ? 'Paid' : 'All';
  //     if (this.searchData === 'All') {
  //       break;
  //     }
  //   }
  //   if (this.filter.controls.filterType.value.length > 0) {
  //     this.OnBeforeListFiltered(this.searchData);
  //   } else {
  //     this.searchData = '';
  //     this.miOutgoingPaymentList.cachedList = [];
  //     this.miOutgoingPaymentList.clientSideSearch.next(true);

  //   }
  // }
  // OnBeforeListFiltered(data) {
  //   const searched = Object.assign([], this.OutgoingPaymentlistData);
  //   const newList = [];
  //   if (this.searchData && this.searchData !== 'All') {
  //     this.searchData = this.searchData.toLowerCase();
  //     for (let n = 0; n < searched.length; n++) {
  //       for (const sortingColumn of this.miOutgoingPaymentList.displayedColumns) {
  //         if (searched[n][sortingColumn] && searched[n][sortingColumn].toLowerCase().indexOf(this.searchData) === 0) {
  //           newList.push(searched[n]);
  //         }
  //       }
  //     }
  //     this.miOutgoingPaymentList.cachedList = newList;
  //     this.miOutgoingPaymentList.clientSideSearch.next(true);
  //   } else {
  //     this.miOutgoingPaymentList.cachedList = (this.OutgoingPaymentlistData) ?
  //       Object.assign([], this.OutgoingPaymentlistData) : Object.assign([], this.miOutgoingPaymentList.miDataSource.tableData);
  //     this.miOutgoingPaymentList.clientSideSearch.next(true);
  //   }
  // }
  OnOutgoingPaymentList() {
    this.isgettingOutgoingList = true;
    const url = this.policyManagerUrl.PolicyDetails.GetOutgoingPaymentList;
    this.miOutgoingPaymentList.url = url;
    this.miOutgoingPaymentList.miDataSource = new TableDataSource(this.policyService);
    this.miOutgoingPaymentList.columnLabels = this.outgoingPayColumnLabel;
    this.miOutgoingPaymentList.displayedColumns = this.outgoingPayDisplayColumn;
    this.miOutgoingPaymentList.columnDataTypes = this.outgoingPayColumnType;
    this.miOutgoingPaymentList.columnIsSortable = ['true', 'true', 'true', 'true', 'true', 'true', 'false'];
    this.miOutgoingPaymentList.refreshHandler = this.outgoingNeedRefresh;
    this.miOutgoingPaymentList.showPaging = true;
    this.miOutgoingPaymentList.resetPagingHandler = this.needPageReset;
    this.miOutgoingPaymentList.pageSize = this.getRouteParamtersService.pageSize
    this.miOutgoingPaymentList.initialPageIndex = this.getRouteParamtersService.pageIndex;
    this.miOutgoingPaymentList.miListMenu = new MiListMenu();
    this.miOutgoingPaymentList.miListMenu.visibleOnDesk = true;
    this.miOutgoingPaymentList.miListMenu.visibleOnMob = false;
    this.miOutgoingPaymentList.showPaging = false;
    this.miOutgoingPaymentList.isClientSideList = true;
    this.miOutgoingPaymentList.isEditablegrid = false;
    this.miOutgoingPaymentList.clientSideSearch = this.searchList;
    this.miOutgoingPaymentList.isMultipleColumnShown = true;
    this.miOutgoingPaymentList.multipleColumHeader = new MultipleColumLabels();
    this.miOutgoingPaymentList.multipleColumHeader.multiplecolumnLabels = ['hidden', 'Outgoing % of', 'hide'];
    this.miOutgoingPaymentList.multipleColumHeader.multipleColumType = {
      'hidden': new MultiplesColumns('', '', '', 'hidden', 1),
      'Outgoing % of': new MultiplesColumns('Outgoing % of', 'Premium', '', 'abc', 2),
      'hide': new MultiplesColumns('', '', '', 'hidden', 7),
    }
    this.miOutgoingPaymentList.miListMenu.menuItems =
      [
        new MiListMenuItem('Reverse', 3, true, true, this.IslinkedDisabled, 'img-icons reverse-icn'),
        new MiListMenuItem('Delete', 3, true, true, this.ActionDisabled_outgoing, 'img-icons delete-icn')
      ];
    this.miOutgoingPaymentList.miDataSource.dataSubject.subscribe(isLoadingDone => {
      if (isLoadingDone && isLoadingDone.length > 0) {
        this.showCount = this.miOutgoingPaymentList.miDataSource.tableData.length;
        if (!this.OutgoingPaymentlistData) {
          this.OutgoingPaymentlistData = this.miOutgoingPaymentList.miDataSource.tableData;
        }
      } else {
        this.showCount = 0;
      }
    });
  }
  // ActionDisabled() {
  //   this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
  //   return (this.userdetails.Permissions[0].Permission === 1) ? true : false;
  // }
  ActionDisabled_outgoing(element) {
    this.userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    return (this.userdetails.Permissions[1].Permission === 1) ? true : false;
  }
  OutgoingPaymentListPrmtrs(data) {
    this.postdata = {
      'policyPaymentEntryId': data.data.PaymentEntryID
    }
    this.miOutgoingPaymentList.requestPostData = this.postdata;
    this.miOutgoingPaymentList.refreshHandler.next(true);
    this.showloading = false;
  }
  OnPageRedirection() {
    if (this.router.url.indexOf('advance-Search') > -1) {
      this.router.navigate(['policy/advance-Search', this.getRouteParamtersService.parentTab,
        this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex]);
    }
    else {
      this.router.navigate(['policy/policyListing', this.getRouteParamtersService.parentTab,
        this.getRouteParamtersService.pageSize, this.getRouteParamtersService.pageIndex],
        { queryParams: { client: this.getRouteParamtersService.ClientId } });
    }
  }
  // OnUpdateOutgoingPayment() {
  //   const list = [];
  //   let Paymentsum = 0;
  //   let TotalPayment = 0;
  //   for (const OutgoingList of this.miOutgoingPaymentList.miDataSource.tableData) {
  //     Paymentsum += Number(OutgoingList.Payment);
  //     TotalPayment += Number(OutgoingList.PaidAmount);
  //     OutgoingList.CreatedOn = null;
  //   }
  //   if (Paymentsum !== 100 && Paymentsum !== 0) {
  //     {
  //       this.isOutgoingValidationShown = true;
  //       this.outgoingValidationMessage = 'The sum of values under "Payment" needs to be 0 or 100.';
  //       this.validationErrorObject = {
  //         'validationShown': true,
  //         'NameofColumn': 'Payment'
  //       };
  //       return;
  //     };
  //   } else if (TotalPayment !== Number(this.incomingSelectedRowData.TotalPayment.replace('$', ''))) {
  //     this.isOutgoingValidationShown = true;
  //     // tslint:disable-next-line:max-line-length
  //     this.outgoingValidationMessage = 'Sum of values in "Total due to Payee" needs to be equal to the incoming total payment. ';
  //     this.validationErrorObject = {
  //       'validationShown': true,
  //       'NameofColumn': 'Total Due to Payee'
  //     };
  //     return;
  //   } else {
  //     this.postdata = {
  //       '_PolicyOutgoingDistribution': this.miOutgoingPaymentList.miDataSource.tableData
  //     };
  //     this.isOutgoingValidationShown = false;
  //     this.outgoingValidationMessage = '';
  //     this.policyService.UpdateOutgoingPayment(this.postdata).subscribe(response => {
  //       if (response.ResponseCode === ResponseCode.SUCCESS) {
  //         this.validationErrorObject = {};
  //         this.miOutgoingPaymentList.refreshHandler.next(true);
  //       }
  //     });
  //   }
  // }
  // OnResetOutgoingList() {
  //   this.isOutgoingValidationShown = false;
  //   this.outgoingValidationMessage = '';
  //   this.miOutgoingPaymentList.refreshHandler.next(true);
  // }
  // CloseValidationMessage() {
  //   this.isOutgoingValidationShown = false;
  //   this.outgoingValidationMessage = '';
  //   this.validationErrorObject = {};
  // }
  ExportToExcel() {
    // create list from datasource
    const list = []
    for (let i = 0; i < this.miIncomingPaymentList.miDataSource.tableData.length; i++) {
      const obj: any = {}
      obj.InvoiceDate = this.miIncomingPaymentList.miDataSource.tableData[i].InvoiceDateString;
      obj.Amount = this.miIncomingPaymentList.miDataSource.tableData[i].PaymentRecived;
      obj.Incoming = this.miIncomingPaymentList.miDataSource.tableData[i].CommissionPercentage;
      obj.Number = this.miIncomingPaymentList.miDataSource.tableData[i].NumberOfUnits;
      obj.DollarPerUnit = this.miIncomingPaymentList.miDataSource.tableData[i].DollerPerUnit;
      obj.Fee = this.miIncomingPaymentList.miDataSource.tableData[i].Fee;
      obj.Share = this.miIncomingPaymentList.miDataSource.tableData[i].SplitPer;
      obj.TotalPayment = this.miIncomingPaymentList.miDataSource.tableData[i].TotalPayment;
      obj.Batch = this.miIncomingPaymentList.miDataSource.tableData[i].BatchNumber;
      obj.StatementDate = this.miIncomingPaymentList.miDataSource.tableData[i].StatementDateString;
      obj.Pageno = this.miIncomingPaymentList.miDataSource.tableData[i].Pageno;
      list.push(obj);
      
    }
    this.excelService.exportAsExcelFileDollar(list, 'PaymentEntries',Object.keys(list[0]));
  }
}
