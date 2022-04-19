


import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';

import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, DoCheck, Output, EventEmitter } from '@angular/core';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Subject } from 'rxjs/Subject';
import { TableDataSource } from '../../_services/table.datasource';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { CommonDataService } from './../../_services/common-data.service';
import { RemoveConfirmationComponent } from './../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-schedule-setting',
  templateUrl: './schedule-setting.component.html',
  styleUrls: ['./schedule-setting.component.scss']
})
export class ScheduleSettingComponent implements OnInit, DoCheck {
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  listColumnName: any;
  listClassName: any;
  that:any;
  gradedScheduleList: any = [{
    'From': '',
    'To': '',
    'Percent': ''
  }];
  nonGradedScheduleList: any = [
    {
      'Year': '', 'Percent': ''
    }
  ];
  Schedule = new FormGroup({
    Mode: new FormControl(0, {}),
    FirstYear: new FormControl('0.00', {}),
    Renewal: new FormControl('0.00', {}),
    CustomType: new FormControl('1', {}),
    FirstYearPer: new FormControl('0.00', {}),
    RenewalYearPer: new FormControl('0.00', {})
  });
  ModeList: any = [
    { key: 'Standard', value: 0 },
    { key: 'Custom', value: 1 }
  ];
  @Output() onSaveScheduleData = new EventEmitter<object>();
  @Input() SceduleData: any;
  @Input() ValidationData: any;
  @Output() OnChangingMode = new EventEmitter<object>();
  @Output() ScheduleData = new EventEmitter<object>();
  @Input() isFormDisabled: any;
  constructor(
    public commonSvc: CommonDataService,
    public dialog: MatDialog,
    public route:ActivatedRoute
  ) { 
  
  }

  ngOnInit() {
    if (this.isFormDisabled) {
      this.Schedule.disable();
    }
    else {
      this.Schedule.enable();
    }
    this.listColumnName = '% of Premium';
    this.listClassName = 'inputDecimalNum'
    this.GetScheduleList();
  }
  ngDoCheck() {
    this.listColumnName = this.SceduleData.isPercentOfPremium === true ? '% of Premium' : 'Per Head';
    this.listClassName = this.SceduleData.isPercentOfPremium === true ? 'inputDecimalNum' : 'inputDollar';
    if (this.SceduleData.isPercentOfPremiumClicked) {
      this.SceduleData.isPercentOfPremiumClicked = false;
      this.GetScheduleList();
      this.MiListProperties.refreshHandler.next(true);
    }
    if (this.SceduleData.isSaveButtonClicked === true || this.SceduleData.isSplitEvenlyClicked) {
      this.onSaveScheduleData.emit({
        formData: this.Schedule,
        gradedScheduleList: this.gradedScheduleList,
        nonGradedScheduleList: this.nonGradedScheduleList
      })
    }
    if (!this.SceduleData['isPolicyTabChange']) {
      this.ScheduleData.emit({
        formData: this.Schedule,
        gradedScheduleList: this.gradedScheduleList,
        nonGradedScheduleList: this.nonGradedScheduleList
      })
    }
    if (this.SceduleData.isScheduleDataFound === true) {
      if (!this.SceduleData['isPolicyTabChange']) {
        const data = this.SceduleData.ScheduleData;
        this.Schedule.controls.Mode.setValue(data.Mode);
        data.CustomType = data.CustomType === null ? null : data.CustomType.toString();
        this.Schedule.controls.CustomType.setValue(data.CustomType);
        data.RenewalPercentage= data.RenewalPercentage && data.RenewalPercentage !='' ? Number(data.RenewalPercentage).toFixed(2):'0.0';
        data.FirstYearPercentage= data.FirstYearPercentage && data.FirstYearPercentage !='' ? Number(data.FirstYearPercentage).toFixed(2):'0.0';
        if (data.ScheduleTypeId == 1) {
          this.Schedule.controls.RenewalYearPer.setValue(data.RenewalPercentage);
          this.Schedule.controls.FirstYearPer.setValue(data.FirstYearPercentage);
        } else {
          this.Schedule.controls.FirstYear.setValue(data.FirstYearPercentage);
          this.Schedule.controls.Renewal.setValue(data.RenewalPercentage);
        }
        if (this.Schedule.controls.Mode.value == 1) {
          if (this.Schedule.controls.CustomType.value === '1') {
            this.gradedScheduleList = data.GradedSchedule;
            this.nonGradedScheduleList =[{
              'Year': '', 'Percent': ''
            }]
          } else {
            this.nonGradedScheduleList = data.NonGradedSchedule;
            this.gradedScheduleList = [{
              'From': '',
              'To': '',
              'Percent': ''
            }];
          }
        } else {
          this.gradedScheduleList = [{
            'From': '',
            'To': '',
            'Percent': ''
          }];
          this.nonGradedScheduleList =[{
            'Year': '', 'Percent': ''
          }]
        }
        this.SceduleData.isScheduleDataFound = false;
        this.GetScheduleList();
        this.MiListProperties.refreshHandler.next(true);
      } else {
        this.Schedule = (this.SceduleData['formScheduleData'].formData as FormGroup);
        this.gradedScheduleList = this.SceduleData['formScheduleData'].gradedScheduleList;
        this.nonGradedScheduleList = this.SceduleData['formScheduleData'].nonGradedScheduleList;
        this.SceduleData.isScheduleDataFound = false;
        this.MiListProperties.refreshHandler.next(true);

        this.SceduleData['isPolicyTabChange'] = false;
        this.GetScheduleList();
      }
    }
  }

  OnModeChange(value) {
    this.GetScheduleList();
    this.OnChangingMode.emit({ data: this.Schedule.controls });
    this.MiListProperties.refreshHandler.next(true);
  }
  OnScheduleChange(value) {
    this.OnChangingMode.emit({ data: this.Schedule.controls });
  }
  GetScheduleList() {
    this.MiListProperties.url='/api/Setting/getScheduleList';
    this.MiListProperties.cachedList = this.Schedule.controls.CustomType.value === '1' ?
      this.gradedScheduleList : this.nonGradedScheduleList;
    this.MiListProperties.miDataSource = new TableDataSource(this.commonSvc);
    this.MiListProperties.displayedColumns = this.Schedule.controls.CustomType.value === '1' ?
      ['From', 'To', 'Percent', 'Action'] : ['Year', 'Percent', 'Action']
    this.MiListProperties.columnLabels = this.Schedule.controls.CustomType.value === '1' ?
      ['From', 'To', this.listColumnName, ''] : ['Year', this.listColumnName, '']
    this.MiListProperties.columnIsSortable = this.Schedule.controls.CustomType.value === '1' ?
      ['false', 'false', 'false', 'false'] : ['false', 'false', 'false']
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = false;
    this.MiListProperties.isEditablegrid = true;
    if (this.Schedule.controls.CustomType.value === '1') {
      this.MiListProperties.fieldType = {
        'From': new MiListFieldType('From', 'From', '', '', 'inputNum',
          '', '', '', '', '', '', ''),
        'To': new MiListFieldType('To', 'To', '', '', 'inputNum',
          '', '', '', '', '', '', ''),
        'Percent': new MiListFieldType('Percent', this.listColumnName, '', 'inline-box', this.listClassName,
          '', '', '', '', '', '%', '')
      };
    } else {
      this.MiListProperties.fieldType = {
        'Year': new MiListFieldType('Year', 'Year', '', '', 'inputNum',
          '', '', '', '', '', '', ''),
        'Percent': new MiListFieldType('Percent', this.listColumnName, '', 'inline-box', this.listClassName,
          '', '', '', '', '', '%', '')
      };
    }

    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn')
      ];
  }
  OnAddRowInList(value) {
    if (value === '1') {
      const data = {
        'GradedFrom': '',
        'GradedTo': '',
        'Percentage': ''
      }
      this.gradedScheduleList.push(data);
    } else {
      const data = {
        'Year': '',
        'Percentage': ''
      }
      this.nonGradedScheduleList.push(data);
    }
    this.MiListProperties.refreshHandler.next(true);
  }

  OnMenuItemClick(data) {
    if (data.name === 'Delete' && !this.isFormDisabled) {
      if (this.Schedule.controls.CustomType.value === '1') {
        if (this.gradedScheduleList.length > 1) {
          this.openDeleteDialogBox(data.event);
        }
      } else {
        if (this.nonGradedScheduleList.length > 1) {
          this.openDeleteDialogBox(data.event);
        }
      }
    }

  }
  CloseValidationMessage() {
    this.ValidationData.isValidationShown = false;
  }

  openDeleteDialogBox(index) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete',
        subTitle: ' Are you sure you want to delete this record?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (this.Schedule.controls.CustomType.value === '1') {
          this.gradedScheduleList.splice(index, 1);
        } else {
          this.nonGradedScheduleList.splice(index, 1);
        }
        this.MiListProperties.refreshHandler.next(true);
      }
    });
  }

}

