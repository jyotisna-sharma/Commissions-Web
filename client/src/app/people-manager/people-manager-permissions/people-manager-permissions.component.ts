import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataService } from '../../_services/table-data.service';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component'
import { TableDataSource } from '../../_services/table.datasource';
import { AppLevelDataService } from '../../_services/app-level-data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { PeoplemanagerService } from '../peoplemanager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { SelectionModel } from '@angular/cdk/collections';
import { ResponseCode } from '../../response.code'
import { ResponseErrorService } from '../../_services/response-error.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './People-manager-permissions.html',
  styleUrls: ['./People-manager-permissions.scss']
})
export class PeopleManagerPermissionsComponent implements OnInit {
  houseAccountValue: boolean;
  hasAccountExecPolicyExist: Boolean = false;
  AdminValue: boolean;
  AgentEditValueDisabled: boolean
  invalidwritepermissions: boolean // for check all write permissions for Admin when Admin is true
  invalidreadpermissions: boolean //  for check all read permissions for Admin when Admin is false
  isfirstYearMoreThanHundred: boolean
  isRenewalYearMoreThanHundred: boolean
  dataToPost: any;
  userCredentialId: any;
  userdetail: any;
  isTooltipShown: Boolean = false;
  showloading = false;
  url: any;
  isButtonDisabled: boolean;
  title: string  // for showing title
  showToggleDisabled: boolean;
  isOutgoingDefaultShown: boolean
  showNickName: string;
  TextLabel: string;
  MiListProperties: MiProperties = new MiProperties();
  getdetails: any; // get the details from localStorage
  needRefresh: Subject<boolean> = new Subject();
  setAdminValue: boolean // set toggle value of Admin on and Off
  postdata: any // for data send to api request
  pagename: string // for showing pagename in breadcrumb
  ShowPopupAgain: boolean;
  moduleName: string;
  roleId: any;
  isHouseAccount: boolean;
  buttonClicked: boolean;
  setting = new FormGroup({
    HouseAccount: new FormControl('', []),
    AccountExec: new FormControl('', []),
    FirstYear: new FormControl('', []),
    RenewalYear: new FormControl('', []),
    AgentEdit: new FormControl('', []),
    Admin: new FormControl('', [])
  });
  GetpopupShown: boolean; // disabled popup for first time
  // AccountExecutiveValue: boolean // for disabled  AccountExecutive based on read Permission
  // AgentEditValue: boolean // for disbale disabled agent edit
  isChangesInListing: boolean;
  columnLabels: string[] = [
    'Module',
    'Read',
    'Write',
    'No Access'
  ]

  displayedColumns: string[] = [
    'ModuleName',
    'ReadRadioButton',
    'WriteRadioButton',
    'NoAccessRadioButton'
  ];

  columnIsSortable: string[] = [
    'false',
    'false',
    'false',
    'false'
  ];

  // @ViewChild('firstyear') firstyearRef: ElementRef;
  constructor(public dialog: MatDialog,
    // private appData: AppLevelDataService,
    private activateroute: ActivatedRoute,
    private router: Router,
    // private _tableDataService: TableDataService,
    public peoplemanagerUrlService: PeopleManagerAPIUrlService,
    public peopleMangerSvc: PeoplemanagerService,
    public getResponseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService
  ) { }

  ngOnInit() {
    this.buttonClicked = false;
    // this.firstnameRef.focus();
    this.isChangesInListing = false;
    this.GetpopupShown = false;
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail.Permissions[0].Permission === 1) {
      this.setting.disable();
      this.isButtonDisabled = true;
    }
    this.moduleName = 'People Manager';
    this.pagename = 'Edit profile';

    this.getrouteParamters.getparameterslist(this.activateroute);
    this.isOutgoingDefaultShown = false;
    if (this.userdetail.HouseAccountDetails.UserCredentialId === this.getrouteParamters.userCredentialId) {

      this.isHouseAccount = true;
    } else {
      this.isHouseAccount = false;
    }
    this.userCredentialId = this.getrouteParamters.userCredentialId;
    this.GetAllSettingDetails();
  }
  ValueChange() {
    this.isChangesInListing = true;
  }
  // ######################################################################################################################################
  setHouseAccountvalue(result) {
    this.isChangesInListing = true;
    if (this.userdetail.IsAdmin && this.userdetail.Role === 2 ||
      this.userdetail.UserCredentialID === this.userdetail.HouseAccountDetails.UserCredentialId ||
      this.userdetail.IsHouseAccount === true || this.userdetail.Role === 1) {
      this.openHouseAccountDialogBox(result, this.houseAccountValue);
    } else {
      this.setting.controls.HouseAccount.setValue(false);
      this.OnReadPermissionDialogBox();
    }
  }
  OnReadPermissionDialogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Alert',
        subTitle: 'You are not permitted to perform this operation.' +
          'Only administrator or house account can modify the house account settings.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
  }
  setAdminvalue(result) {
    this.isChangesInListing = true;
    this.AssignReadPermissionDialogBox(result.checked, this.AdminValue);
  }
  // ######################################################################################################################################
  // ---------------------------------------------get all details of user settings -----------------------------------------------------
  GetAllSettingDetails() {
    // this.showloading = true;
    this.dataToPost = { 'userCredentialId': this.getrouteParamters.userCredentialId }
    this.peopleMangerSvc.getagentdetails(this.dataToPost).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.hasAccountExecPolicyExist = response.UserObject.HasAssociatedPolicies;
        if (this.hasAccountExecPolicyExist) {
          this.isTooltipShown = true;
          this.setting.controls.AccountExec.disable();
        } else {
          this.setting.controls.AccountExec.enable();
        }
        this.roleId = response.UserObject.Role;
        if (response.UserObject.Role === 3) {
          this.isOutgoingDefaultShown = false;
          this.TextLabel = 'House Account';
          this.showNickName = '-' + ' ' + response.UserObject.NickName
          this.setting.controls.HouseAccount.setValue(response.UserObject.IsHouseAccount);
          this.houseAccountValue = response.UserObject.IsHouseAccount;
          this.showToggleDisabled = response.UserObject.IsHouseAccount;

          this.setting.controls.AccountExec.setValue(response.UserObject.IsAccountExec);
          this.setting.controls.AgentEdit.setValue(response.UserObject.DisableAgentEditing);
          this.setting.controls.FirstYear.setValue(response.UserObject.FirstYearDefault === 0 ? '' : response.UserObject.FirstYearDefault);
          this.setting.controls.RenewalYear.setValue(response.UserObject.RenewalDefault === 0 ? '' : response.UserObject.RenewalDefault);
          this.GetpopupShown = true;
        } else {
          this.isOutgoingDefaultShown = true;
          this.TextLabel = 'Admin';
          this.showNickName = '-' + ' ' + response.UserObject.NickName;
          this.setting.controls.Admin.setValue(response.UserObject.IsAdmin);
          this.AdminValue = response.UserObject.IsAdmin;
          this.setting.controls.AccountExec.setValue(response.UserObject.IsAccountExec);
          this.GetpopupShown = true;
        }
      }

    })
    this.getSeetingdetails();

  }
  // ######################################################################################################################################
  // -------------------------------getting list of Permissions-----------------------------------------------------
  getSeetingdetails() {
    this.url = this.peoplemanagerUrlService.PeoplemanagerAPIRoute.GetAgentSettingDetails
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.peopleMangerSvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = false;
    this.MiListProperties.miListMenu.visibleOnMob = true;
    this.MiListProperties.showPaging = false;
    this.MiListProperties.requestPostData = this.dataToPost;

  }
  // ######################################################################################################################################
  OnPageRedirection(value) {
    if (value.data.url.indexOf('people/CreateNewAgent') > -1) {
      this.router.navigate(['people/Agentlisting', '1', '10', '0']);
    } else if (value.data.url.indexOf('people/CreateNewUser') > -1) {
      this.router.navigate(['people/Userlisting', '2', '10', '0']);
    } else {
      if (value.data.parentTab === '1') {
        this.router.navigate(['people/Agentlisting',
          this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
      } else {
        this.router.navigate(['people/Userlisting',
          this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
      }
    }
  }
  // ######################################################################################################################################
  // -------------------------------Account Default Section for Agent-----------------------------------------------------
  openHouseAccountDialogBox(currentValue, previousValue) {
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Confirmation',
        subTitle: 'Are you sure you want to transfer house account to another agent?',
        extraText: 'Current house account:',
        functionName: 'updateHouseAccount'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.postdata = { 'userCredentialId': this.getrouteParamters.userCredentialId, 'licenseeId': this.userdetail['LicenseeId'] }
        this.peopleMangerSvc.houseAccountUpdate(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.userdetail.HouseAccountDetails.UserCredentialId = this.getrouteParamters.userCredentialId;
            this.userdetail.HouseAccountDetails.NickName = this.showNickName;
            localStorage.setItem('loggedUser', JSON.stringify(this.userdetail));
            this.setting.controls.HouseAccount.setValue(currentValue.checked);
            this.showToggleDisabled = currentValue.checked;
          }
          this.getSeetingdetails();
          this.MiListProperties.refreshHandler.next(true);
        })
      } else {
        this.setting.controls.HouseAccount.setValue(previousValue);
      }

    })

  }

  OnConfirmationdilog(Message: string) {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.title,
        subTitle: Message,
        buttonName: 'ok',
        isCommanFunction: false
      },
      disableClose: true,
    });
  }
  AssignReadPermissionDialogBox(currentValue, PreviousValue) {
    const dialogRef = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Confirmation',
        subTitle: currentValue === false ?
          // tslint:disable-next-line:max-line-length
          'Please note that after removing "Admin" rights, user will be granted only "Read" access to all modules. Do you want to continue?' :
          'Please note that to grant "Admin" rights, user will be granted "Write" access to all modules. Do you want to continue?'
        ,
        functionName: 'ChangeAdminStatus',
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.postdata = {
          'userCredentialId': this.getrouteParamters.userCredentialId,
          'adminStatus': currentValue,
        }
        this.peopleMangerSvc.ChangeAdminStatus(this.postdata).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.setting.controls.Admin.setValue(currentValue);
            this.AdminValue = currentValue;
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.getResponseError.OpenResponseErrorDilog(response.Message);
          }
        });

      } else {
        this.setting.controls.Admin.setValue(PreviousValue);
      }

    })

  }
  // ######################################################################################################################################
  // -------------------------------------Save details of user on update clicks--------------------------------------------------
  Updatedetails() {
    this.buttonClicked = true;
    this.invalidwritepermissions = false;
    this.invalidreadpermissions = false;
    // check for Admin Permissions  based on Admin toggle button

    if (this.setting.controls.Admin.value === true || this.setting.controls.Admin.value === false
      || this.userdetail.HouseAccountDetails.UserCredentialId === this.getrouteParamters.userCredentialId) {
      for (const permissions of this.MiListProperties.miDataSource.tableData) {
        if (permissions.PermissionName !== 'WriteRadioButton' && this.setting.controls.Admin.value === true) {
          this.invalidwritepermissions = true;
        } else if (permissions.PermissionName !== 'ReadRadioButton' && (this.setting.controls.Admin.value !== true && this.isOutgoingDefaultShown)) {
          this.invalidreadpermissions = true;
        }
        else if (permissions.PermissionName !== 'WriteRadioButton' && this.userdetail.HouseAccountDetails.UserCredentialId === this.getrouteParamters.userCredentialId && !this.isOutgoingDefaultShown) {
          this.invalidwritepermissions = true;
        }
      }
      let Message = '';
      if (this.userdetail.HouseAccountDetails.UserCredentialId === this.getrouteParamters.userCredentialId && !this.isOutgoingDefaultShown) {
        Message = 'Please note that "House Account" should have "Write" access to all modules. Kindly grant the rights accordingly. '
      }
      else {
        Message = 'Please note that "Admin" role should have "Write" access to all modules and "User" role should have "Read" access to all modules. Kindly grant the rights accordingly. '
      }
      this.title = 'Alert'
      if (this.invalidwritepermissions === true) {
        this.OnConfirmationdilog(Message)
        return;
      } else if (this.invalidreadpermissions === true) {
        this.OnConfirmationdilog(Message)
        return;
      }
    }
    this.isfirstYearMoreThanHundred = false
    this.isRenewalYearMoreThanHundred = false
    if (this.setting.controls.FirstYear.value > 100 && this.setting.controls.RenewalYear.value > 100) {
      this.isfirstYearMoreThanHundred = true
      this.isRenewalYearMoreThanHundred = true
      return;
    } else if (this.setting.controls.FirstYear.value > 100) {
      this.isfirstYearMoreThanHundred = true
      return;
    } else if (this.setting.controls.RenewalYear.value > 100) {
      this.isRenewalYearMoreThanHundred = true
      return;
    }
    this.showloading = true;
    this.dataToPost = {
      'userDetails':
      {
        'Permissions': this.MiListProperties.miDataSource.tableData,
        'IsAccountExec': this.setting.controls.AccountExec.value === '' ? false : this.setting.controls.AccountExec.value,
        'DisableAgentEditing': this.setting.controls.AgentEdit.value === '' ? false : this.setting.controls.AgentEdit.value,
        'RenewalDefault': this.setting.controls.RenewalYear.value === '' ? 0 : this.setting.controls.RenewalYear.value,
        'FirstYearDefault': this.setting.controls.FirstYear.value === '' ? 0 : this.setting.controls.FirstYear.value
      },
      'userCredentialId': this.userCredentialId
    }
    this.peopleMangerSvc.addUpdateAgentSettingDetails(this.dataToPost).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        this.title = this.roleId === 2 ? 'User Updated Successfully' : 'Agent Updated Successfully';
        this.OnRedirectionToPage();
        this.OnConfirmationdilog(response.Message)
      } else {
        this.showloading = false;
        this.getResponseError.OpenResponseErrorDilog(response.Message);
      }
    });
  }
  // ##############################################################################################################
  onMenuItemClick(obj) {
    if (obj.name != 'row-click') {
      if (this.userdetail.Permissions[0].Permission === 2) {
        this.isChangesInListing = true
        if (obj && obj.data) {
          obj.data.PermissionName = obj.name
        }
      }
    }

  }

  // -------------------------------------this section contains Cancel button click and Redirection-----------------------------------------
  OnbuttonCancel() {
    this.OnRedirectionToPage();
  }
  OnRedirectionToPage() {
    this.buttonClicked = true;
    if (this.getrouteParamters.parentTab === '1') {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['people/Agentlisting', this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    } else {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['people/Userlisting', this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
  }
  // ##############################################################################################################
}

