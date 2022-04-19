import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from '../../response.code';
import { Guid } from 'guid-typescript';
import { SettingValidationMessageService } from '../setting-validation-message.service';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../settings.service';
import { MatDialog } from '@angular/material/dialog';
import { ResponseErrorService } from '../../_services/response-error.service';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { SettingsOverwriteComponent } from '../../_services/dialogboxes/settings-overwrite/settings-overwrite.component';
export class CustomModeData {
  static Mode: any;
  static FirstYearPercentage: any;
  static RenewalPercentage: any;
  static CustomType: any;
  static GradedSchedule: any;
  static NonGradedSchedule: any;
}
@Component({
  selector: 'app-create-setting-schedule',
  templateUrl: './create-setting-schedule.component.html',
  styleUrls: ['./create-setting-schedule.component.scss']
})
export class CreateSettingScheduleComponent implements OnInit {
  postData: any;
  userdetail: any;
  payorList: any;
  carrierList: any;
  productList: any;
  productTypes: any;
  showloading: Boolean;
  payTypesList: any;
  isRecordExist: Boolean = false
  ModuleName: any;
  isTitleAlreadyExist: Boolean = false;
  textShown: any;
  buttonText: any;
  buttonClicked: Boolean = false;
  isValidationShown: Boolean = false;
  splitPercentValidationShown: Boolean = false;
  validationMessagetext: any;
  createEmptyGuid = Guid.createEmpty().toJSON().value;
  isPercentOfPremium: Boolean = true;
  createSchedule = new FormGroup({
    Payor: new FormControl('', [Validators.required]),
    Carrier: new FormControl('', [Validators.required]),
    Product: new FormControl('', [Validators.required]),
    ProductType: new FormControl('', [Validators.required]),
    Type: new FormControl('', []),
    //  FirstYearPer: new FormControl('', []),
    //  RenewalYearPer: new FormControl('', []),
    //  FirstYearDollar: new FormControl('', []),
    //  RenewalYearDollar: new FormControl('', []),
    Split: new FormControl('100.00', []),
    AdvancePayment: new FormControl('', []),
    Schedule: new FormControl('1', []),
    Title: new FormControl('', [])

  });
  customScheduleData: any = {
    'isPercentOfPremium': true,
    'isSaveButtonClicked': false,
    'isScheduleDataFound': false,
    'ScheduleData': null,
    'isPercentOfPremiumClicked': false
  };
  validationData: any = {
    'isValidationShown': false,
    'validationMessage': ''

  };
  isScheduleCreated: Boolean = false;
  constructor(
    public dataService: CommonDataService,
    public validationMsg: SettingValidationMessageService,
    public activateRoute: ActivatedRoute,
    public getRouterparamter: GetRouteParamtersService,
    public route: Router,
    public sttngSvc: SettingsService,
    public dialog: MatDialog,
    // public customModeData: CustomModeData
  ) { }

  ngOnInit() {
    this.ModuleName = 'Settings';
    this.textShown = 'Commission Schedules';
    this.getRouterparamter.getparameterslist(this.activateRoute);
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    if (this.userdetail.Permissions[2].Permission === 1) {
      this.createSchedule.disable();
    }
    if (this.getRouterparamter.childTab == 1) {
      this.createSchedule.controls.Carrier.disable();
      this.createSchedule.controls.ProductType.disable();
      this.GetPayorList();
      this.GetProductList();
      this.getPayTypes();
    }
    if (this.getRouterparamter.IncomingScheduleId) {
      this.GetScheduleDetails();
      this.buttonText = 'Update';
    } else {
      // this.SetInitialValue();
      this.buttonText = 'Add';
    }
  }
  GetPayorList() {
    this.showloading = true;
    this.postData = {
      'LicenseeID': this.userdetail['LicenseeId']
    }
    this.dataService.getPayorsList(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.payorList = response.PayorList;
        this.showloading = false;
      }
    });
  }
  GetScheduleDetails() {
    this.showloading = true;
    this.postData = {
      'incomingScheduleId': this.getRouterparamter.IncomingScheduleId
    }
    this.sttngSvc.GetScheduleDetails(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.customScheduleData.isScheduleDataFound = true;
        this.customScheduleData.ScheduleData = response.ScheduleDetails;
        const gettingdetails = response.ScheduleDetails;
        this.customScheduleData['isPercentOfPremium'] = response.ScheduleDetails.ScheduleTypeId == 1 ? true : false
        this.createSchedule.controls.Split.setValue(Number(gettingdetails.SplitPercentage).toFixed(2));
        this.createSchedule.controls.AdvancePayment.setValue(gettingdetails.Advance === 0 ? '' : gettingdetails.Advance);
        if (this.getRouterparamter.childTab == 1) {
          this.createSchedule.controls.Payor.setValue(gettingdetails.PayorID);
          this.GetCarrierList(gettingdetails.PayorID);
          this.createSchedule.controls.Carrier.setValue(gettingdetails.CarrierID);
          this.createSchedule.controls.Product.setValue(gettingdetails.CoverageID);
          this.getProductType();
          this.createSchedule.controls.ProductType.setValue(gettingdetails.ProductType);
          this.createSchedule.controls.Type.setValue(gettingdetails.IncomingPaymentTypeID);
        } else {
          this.createSchedule.controls.Title.setValue(gettingdetails.Title);
          this.showloading = false;
        }
        const ScheduleTypeId = gettingdetails.ScheduleTypeId.toString();
        this.createSchedule.controls.Schedule.setValue(ScheduleTypeId);
      }
    });

  }
  OnClosePopup() {
    this.isValidationShown = false;
    this.isRecordExist = false;
  }
  GetCarrierList(payorData) {
    this.createSchedule.controls.Carrier.setValue('');
    this.postData = {
      'payorId': payorData.value ? payorData.value : payorData
    }
    this.productTypes = null;
    this.dataService.getCarrierList(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.carrierList = response.CarrierList;
        if (this.carrierList) {
          if (this.userdetail.Permissions[1].Permission !== 1) {
            this.createSchedule.controls.Carrier.enable();
            this.getProductType();
          }
        }
      }
    });

  }
  OnCarrierChange()
  {
    this.createSchedule.controls.ProductType.setValue('');
    this.createSchedule.controls.ProductType.disable();
    this.getProductType();
  }
  GetProductList() {
    this.postData = {
      'LicenseeID': this.userdetail['LicenseeId']
    };
    this.dataService.getProductsList(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.productList = response.DisplayCoverageList;
      }
    });
    this.productTypes = null;
    this.getProductType();
  }
  getProductTypeList() {
    this.createSchedule.controls.ProductType.setValue('');
    this.createSchedule.controls.ProductType.disable();
    this.getProductType();
  }
  getProductType() {
    const PayorId = this.createSchedule.controls.Payor.value;
    const CarrierID = this.createSchedule.controls.Carrier.value;
    const CoverageId = this.createSchedule.controls.Product.value;
    this.postData = {
      'PayorId': this.createSchedule.controls.Payor.value,
      'CarrierId': this.createSchedule.controls.Carrier.value === '' ?
        this.createEmptyGuid.value : this.createSchedule.controls.Carrier.value,
      'CoverageId': this.createSchedule.controls.Product.value === '' ?
        this.createEmptyGuid.value : this.createSchedule.controls.Product.value
    }
    if (PayorId && CarrierID && CoverageId) {

      this.dataService.getProductTypes(this.postData).subscribe(response => {
        //   this.createSchedule.controls.ProductType.setValue('');
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          this.productTypes = response.CoverageNickNameList;
          if (this.productTypes && this.productTypes.length > 0) {
            if (this.userdetail.Permissions[1].Permission !== 1) {
              this.createSchedule.controls.ProductType.enable();
            }
          }
        } else {
          this.createSchedule.controls.ProductType.setValue('');
          this.createSchedule.controls.ProductType.disable();
          return;
        }
      });
    }
  }
  getPayTypes() {
    this.postData = {};
    this.dataService.getIncomingPaymentTypes(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.payTypesList = response.PolicyIncomingPaymentList;
        if (!this.createSchedule.controls.Type.value) {
          this.createSchedule.controls.Type.setValue(this.payTypesList[1].PaymentTypeId);
        }
      }
    });
  }
  // ------------------------------------------------------------- -------------------------------------------------------------------
  OnScheduleChanges(data) {
    this.customScheduleData['isPercentOfPremiumClicked'] = true;
    if (this.createSchedule.controls.Schedule.value === '2') {
      this.customScheduleData['isPercentOfPremium'] = false;
    } else {
      this.customScheduleData['isPercentOfPremium'] = true;
    }
  }
  OnAddingSchedule() {
    if (this.getRouterparamter.childTab == 2) {
      Object.keys(this.createSchedule.controls).forEach(key => {
        this.createSchedule.get(key).setValidators([]);
        this.createSchedule.get(key).updateValueAndValidity();
      });
      this.createSchedule.controls.Title.setValidators([Validators.required]);
      this.createSchedule.controls.Title.updateValueAndValidity();
    }
    if (!this.createSchedule.valid) {
      this.customScheduleData.isSaveButtonClicked = false;
      this.ValidateAllFormField(this.createSchedule);
      return;
    } else if ((!this.createSchedule.controls.ProductType.value || !this.createSchedule.controls.Carrier.value) && this.getRouterparamter.childTab == 1) {
      this.isValidationShown = true;
      this.validationMessagetext = this.validationMsg.SettingValidations.IncomingPaymentFieldsNotBlank;
      return;
    } else if (this.getRouterparamter.childTab == 2 && this.isTitleAlreadyExist) {
      return;
    }
    this.buttonClicked = true;
    const controls = this.createSchedule.controls;
    if (!controls.Split.value || Number(controls.Split.value) === 0) {
      this.splitPercentValidationShown = true;
      this.isValidationShown = false;
      this.isRecordExist = false;
      return;
    } else {
      this.customScheduleData.isSaveButtonClicked = true;
    }
  }
  OnSaveCustomScheduleData(scheduleData) {
    CustomModeData.Mode = scheduleData.formData.controls.Mode.value;
    CustomModeData.CustomType = scheduleData.formData.controls.CustomType.value;
    if (scheduleData.formData.controls.Mode.value === 0) {
      CustomModeData.FirstYearPercentage = this.customScheduleData['isPercentOfPremium'] == true ?
        scheduleData.formData.controls.FirstYearPer.value : scheduleData.formData.controls.FirstYear.value;
      CustomModeData.RenewalPercentage = this.customScheduleData['isPercentOfPremium'] == true ?
        scheduleData.formData.controls.RenewalYearPer.value : scheduleData.formData.controls.Renewal.value;
      CustomModeData.NonGradedSchedule = null;
      CustomModeData.GradedSchedule = null;
      CustomModeData.CustomType = 1;
    } else {
      CustomModeData.FirstYearPercentage = null;
      CustomModeData.RenewalPercentage = null;
      if (scheduleData.formData.controls.CustomType.value === '1') {
        CustomModeData.GradedSchedule = scheduleData.gradedScheduleList
        CustomModeData.NonGradedSchedule = null
      } else {
        CustomModeData.NonGradedSchedule = scheduleData.nonGradedScheduleList
        CustomModeData.GradedSchedule = null;
      }
    }

    if (this.OnValidateCustomSchedules()) {
      if (!this.isScheduleCreated) {
        this.validationData.isValidationShown = false;
        this.validationData.validationMessage = "";
        if (this.getRouterparamter.childTab == 1) {
          this.OnSavedPayorSchedule();
        } else {
          this.onSavedNamedSchedule();
        }
        this.isScheduleCreated = true;
      }
    } else {
      this.customScheduleData.isSaveButtonClicked = false;
      this.validationData.isValidationShown = true;
      this.validationData.validationMessage = this.validationMessagetext;
      this.isRecordExist = false;
      this.isValidationShown = false;
      this.isScheduleCreated = false;
    }
  }
  OnValidateCustomSchedules = (): any => {
    this.customScheduleData.isSaveButtonClicked = false;
    let isScheduleValid = false;
    const controls = this.createSchedule.controls;
    const fieldName = this.customScheduleData['isPercentOfPremium'] == true ? '% of Premium' : 'Per Head';
    const sortBy = CustomModeData.CustomType === '1' ? 'From' : 'Year';
    if (!controls.Split.value || Number(controls.Split.value) === 0) {
      this.splitPercentValidationShown = true;
      this.isRecordExist = false;
      return isScheduleValid;
    } else {
      if (CustomModeData.Mode === 0) {
        if ((controls.Schedule.value === '1' || controls.Schedule.value === '2') &&
          (Number(CustomModeData.FirstYearPercentage) === 0 && Number(CustomModeData.RenewalPercentage) === 0)) {
          this.validationMessagetext = this.getRouterparamter.childTab === '1' ?
            this.validationMsg.SettingValidations.FieldsNotBlank : this.validationMsg.SettingValidations.NamedScheduleFieldsNotBlank;
          return isScheduleValid;

        } else {
          isScheduleValid = true;
        }
      } else {
        if (CustomModeData.CustomType === '1') {
          let isBlankFieldFound = [];
          isBlankFieldFound = CustomModeData.GradedSchedule.filter(item => {
            if ((!item.Percent || Number(item.Percent) === 0)
              || (!item.From || Number(item.From) === 0)
              || (!item.To || Number(item.To) === 0)) {
              this.validationMessagetext = sortBy + ',' + ' ' + 'To' + ' ' + 'or' + ' '
                + fieldName + ' ' + `field  cannot be blank or '0'.`;
              return true;
            }
            if (Number(item.From) >= Number(item.To)) {
              this.validationMessagetext = 'To value must be greater than From value.';
              return true;
            }
          });
          if (isBlankFieldFound.length > 0) {
            return isScheduleValid
          } else {
            CustomModeData.GradedSchedule = CustomModeData.GradedSchedule.sort(this.SortFunction);
            if (Number(CustomModeData.GradedSchedule[0][sortBy]) !== 1) {
              this.validationMessagetext = `Range is missing with 'From' value starting from '1'.`
              return isScheduleValid;
            } else {
              let From = 1;
              for (const item of CustomModeData.GradedSchedule) {
                if (Number(item.From) !== From) {
                  this.validationMessagetext = `'From' value in the range must be the next number of 'To' value in previous range.`;
                  isScheduleValid = false;
                  return isScheduleValid;
                } else {
                  From = Number(item.To) + 1;
                  isScheduleValid = true;
                }
              }
            }
          }

        } else {
          let isBlankFieldFound = [];
          isBlankFieldFound = CustomModeData.NonGradedSchedule.filter(item => {
            if (!item.Year || Number(item.Year) === 0 || (!item.Percent || Number(item.Percent) === 0)) {
              this.validationMessagetext = sortBy + ' ' + 'or' + ' ' + fieldName + ' ' + `field cannot be blank or '0'.`
              return true;
            }
          });
          if (isBlankFieldFound.length > 0) {
            isScheduleValid = false;
            return isScheduleValid
          } else {
            CustomModeData.NonGradedSchedule = CustomModeData.NonGradedSchedule.sort(this.SortFunction);
            if (Number(CustomModeData.NonGradedSchedule[0][sortBy]) !== 1) {
              this.validationMessagetext = 'Year 1 schedule is missing.'
              return isScheduleValid;
            } else {
              let Year = 1;

              for (const item of CustomModeData.NonGradedSchedule) {
                if (Number(item.Year) !== Year) {
                  this.validationMessagetext = 'Year numbers must be consecutive without missing any value in between.'
                  isScheduleValid = false;
                  return isScheduleValid;
                } else {
                  Year = Number(item.Year) + 1;
                  isScheduleValid = true;
                }
              }
            }
          }
        }
      }
    }
    return isScheduleValid;
  }
  SortFunction(firstrecord, secondRecord, ) {
    const sortBy = CustomModeData.CustomType === '1' ? 'From' : 'Year';
    const firstNumber = Number(firstrecord[sortBy]);
    const secondNumber = Number(secondRecord[sortBy]);
    return firstNumber > secondNumber ? 1 : -1;
  }
  IsScheduleExist() {
    this.postData = {
      'scheduleName': this.createSchedule.controls.Title.value,
      'incomingScheduleId': this.getRouterparamter.IncomingScheduleId,
      'licenseeId': this.userdetail['LicenseeId']
    }

    this.sttngSvc.IsNamedScheduleExist(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {

        if (response.isExist === true) {
          // this.isRecordExist = true;
          this.isTitleAlreadyExist = true;
          // this.validationMessagetext = this.validationMsg.SettingValidations.NamedScheduleExist;
        } else {
          this.isTitleAlreadyExist = false;
        }
      }
    });
  }
  // ----------------------------------------------------------------------------------------------------------------------
  OnSavedPayorSchedule() {
    const controls = this.createSchedule.controls;
    this.postData = {
      'parameters': {
        'IncomingPaymentTypeID': controls.Type.value,
        'LicenseeID': this.userdetail['LicenseeId'],
        'PayorID': controls.Payor.value,
        'CarrierID': controls.Carrier.value,
        'CoverageID': controls.Product.value,
        'ProductType': controls.ProductType.value
      }
    }
    this.sttngSvc.IsScheduleExist(this.postData).subscribe(response => {
      this.showloading = true;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        if (this.getRouterparamter.IncomingScheduleId) {
          if (response.ScheduleDetails && response.ScheduleDetails.IncomingScheduleID === this.getRouterparamter.IncomingScheduleId) {
            this.OnShownSavedPopup(controls)
          } else if (response.ScheduleDetails && response.ScheduleDetails.IncomingScheduleID === this.createEmptyGuid) {
            this.OnShownSavedPopup(controls)
          } else {
            this.isRecordExist = true;
            this.isValidationShown = false;
            this.isScheduleCreated = false;
            this.validationMessagetext = this.validationMsg.SettingValidations.RecordExist;
          }
        } else {
          if (response.ScheduleDetails && response.ScheduleDetails.IncomingScheduleID === this.createEmptyGuid) {
            this.OnShownSavedPopup(controls)
          } else {
            this.isRecordExist = true;
            this.isValidationShown = false;
            this.isScheduleCreated = false;
            this.validationMessagetext = this.validationMsg.SettingValidations.RecordExist;

          }
        }
      }
    });
  }
  // #########################################################################################################################
  // ---------------------------------------------------------------------------------------------------------------------------
  onSavedNamedSchedule() {
    this.showloading = true;
    const controls = this.createSchedule.controls;
    this.postData = {
      'schedule': {
        'IncomingScheduleID': this.getRouterparamter.IncomingScheduleId ?
          this.getRouterparamter.IncomingScheduleId : Guid.create().toJSON().value,
        'LicenseeID': this.userdetail['LicenseeId'],
        'ScheduleTypeId': controls.Schedule.value,
        'SplitPercentage': controls.Split.value ? controls.Split.value : 100,
        'Advance': Number(controls.AdvancePayment.value),
        'CreatedBy': this.userdetail['UserCredentialID'],
        'ModifiedBy': this.userdetail['UserCredentialID'],
        'Title': controls.Title.value,
        'Mode': CustomModeData.Mode,
        'FirstYearPercentage': !CustomModeData.FirstYearPercentage ? 0 : CustomModeData.FirstYearPercentage,
        'RenewalPercentage': !CustomModeData.RenewalPercentage ? 0 : CustomModeData.RenewalPercentage,
        'CustomType': CustomModeData.CustomType,
        'GradedSchedule': CustomModeData.GradedSchedule,
        'NonGradedSchedule': CustomModeData.NonGradedSchedule
      },
    }
    this.sttngSvc.AddupdateNamedSchedule(this.postData).subscribe(response => {
      this.showloading = false;
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.OnPageNavigationChange(false);
        if (this.showloading === false) {
          this.OpenSettingCreationdilog();
        }
      }
    });
  }
  // ########################################################################################################################
  OnShownSavedPopup(controls) {
    const dilogref = this.dialog.open(SettingsOverwriteComponent, {
      data: {},
      width: '650px',
      disableClose: true
    });
    dilogref.afterClosed().subscribe(result => {

      if (!result && result !== 0) {
        this.isScheduleCreated = false;

      } else {
        this.showloading = true;
        this.postData = {
          'schedule': {
            'IncomingScheduleID': this.getRouterparamter.IncomingScheduleId ?
              this.getRouterparamter.IncomingScheduleId : Guid.create().toJSON().value,
            'LicenseeID': this.userdetail['LicenseeId'],
            'PayorID': controls.Payor.value,
            'CarrierID': controls.Carrier.value,
            'CoverageID': controls.Product.value,
            'ProductType': controls.ProductType.value,
            'ScheduleTypeId': controls.Schedule.value,
            'IncomingPaymentTypeID': controls.Type.value,
            'SplitPercentage': controls.Split.value ? controls.Split.value : 100,
            'Advance': Number(controls.AdvancePayment.value),
            'CreatedBy': this.userdetail['UserCredentialID'],
            'ModifiedBy': this.userdetail['UserCredentialID'],
            'Mode': CustomModeData.Mode,
            'FirstYearPercentage': !CustomModeData.FirstYearPercentage ? 0 : CustomModeData.FirstYearPercentage,
            'RenewalPercentage': !CustomModeData.RenewalPercentage ? 0 : CustomModeData.RenewalPercentage,
            'CustomType': CustomModeData.CustomType,
            'GradedSchedule': CustomModeData.GradedSchedule,
            'NonGradedSchedule': CustomModeData.NonGradedSchedule
          },
          'overwrite': result
        }
        this.sttngSvc.AddupdateCommissionSchedule(this.postData).subscribe(response => {
          this.showloading = false;
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.OnPageNavigationChange(false);
            if (this.showloading === false) {
              this.OpenSettingCreationdilog();
            }
          }
        });
      }
    });
  }
  ValidateAllFormField(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
      }
    });
  }
  OnSaveSchedule(postdata: any) {
    this.sttngSvc.AddupdateCommissionSchedule(postdata).subscribe(getresponse => {
      if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
        this.OnPageNavigationChange(false);
        if (this.showloading === false) {
          this.OpenSettingCreationdilog();
        }
      }
    });
  }
  OnPageNavigationChange(isButtonClicked) {
    let redirectRoute = '';
    if (this.getRouterparamter.childTab == 1) {
      redirectRoute = '/settings/commissionScheduleListing'
    }
    else {
      redirectRoute = '/settings/NamedScheduleListing'
    }
    if (isButtonClicked !== 'false') {
      this.buttonClicked = true;
    }
    this.route.navigate([redirectRoute,
      this.getRouterparamter.parentTab, this.getRouterparamter.childTab, this.getRouterparamter.pageSize, this.getRouterparamter.pageIndex]);
  }

  OnOpensavedPopup() {
    const dilogref = this.dialog.open(SettingsOverwriteComponent, {
      data: {},
      width: '650px'
    });
  }

  OpenSettingCreationdilog() {
    this.showloading = true;
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.getRouterparamter.IncomingScheduleId ? ' Setting Updated Successfully' : 'Setting Created Successfully ',
        subTitle: this.getRouterparamter.IncomingScheduleId ? 'Setting has been successfully updated in the system.' :
          'Setting has been successfully added in the system.',
        primarybuttonName: 'Create Another Setting',
        secondryButtonName: 'Go to Setting List', // 'Go to Smart Fields/Notes',
        isCommanFunction: true,
        numberofButtons: this.getRouterparamter.IncomingScheduleId ? '1' : '2'
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = false;
        this.route.navigate(['/settings/createSchedule', this.getRouterparamter.parentTab, this.getRouterparamter.childTab, this.getRouterparamter.pageSize,
          this.getRouterparamter.pageIndex]);
      } else {

      }
    });
  }
}

