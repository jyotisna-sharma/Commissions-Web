import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CONSTANTS } from '../../../assets/config/CONSTANTS';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { Guid } from 'guid-typescript';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ResponseCode } from '../../response.code';
@Component({
  selector: 'app-follow-up-setting',
  templateUrl: './follow-up-setting.component.html',
  styleUrls: ['./follow-up-setting.component.scss']
})
export class FollowUpSettingComponent implements OnInit {
  title: any;
  validationMessage: any;
  isValidationShown: boolean = false;
  postData: any;
  showloading: Boolean = false;
  FollowUpDetails = new FormGroup({
    days: new FormControl('', [Validators.required,Validators.maxLength(3)]),
    Status: new FormControl('', {}),
  });
  constructor(
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public getRouterParametersvc: GetRouteParamtersService
  ) { }

  ngOnInit() {
    this.showloading = true;
    this.title = 'Follow Up setting';
    this.GetFollowupSettingDetails();
  }
  OnSavedetails() {
    this.FollowUpDetails.controls.days.valueChanges.subscribe(result => {
      if (!result) {
        this.isValidationShown = false;
      }
    });
    if (!this.FollowUpDetails.valid) {
      this.OnValidateFormField(this.FollowUpDetails);
      return;
    }
    if (this.FollowUpDetails.controls.days.value == 0) {
      this.isValidationShown = true;
      this.validationMessage = 'Number of days can not be 0.' 
      return;
    } 
    else {
      this.isValidationShown = false;
      this.OnUpdateFollowUpSetting();
    }
  }
  OnUpdateFollowUpSetting() {
    this.showloading = true;
    this.postData = {
      'name': 'NextFollowUpRunDaysCount',
      'value': this.FollowUpDetails.controls.days.value
    };
    this.configService.SaveFollowUpSetting(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.postData = {
          'name': 'FollowUpService',
          'value': this.FollowUpDetails.controls.Status.value
        };
        this.configService.SaveFollowUpSetting(this.postData).subscribe(response => {
          if (response.ResponseCode === ResponseCode.SUCCESS) {
            this.showloading = false;
          }
        });
      }
    });
  }
  GetFollowupSettingDetails() {
    this.postData = {
      'key': 'NextFollowUpRunDaysCount',
    };
    this.configService.GetFollowUpSettingDetails(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.FollowUpDetails.controls.days.setValue(response.StringValue);
        this.postData = {
          'key': 'FollowUpService',
        };
        this.configService.GetFollowUpSettingDetails(this.postData).subscribe(response => {
          this.FollowUpDetails.controls.Status.setValue(response.StringValue);
          this.showloading = false;
        });
      }
    });
  }
  OnValidateFormField(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach((field) => {
      const fieldName = formgroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  OnResetValues() {
    this.showloading = true;
    this.GetFollowupSettingDetails();
  }
}
