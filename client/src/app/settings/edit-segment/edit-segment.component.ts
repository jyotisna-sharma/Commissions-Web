import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { SegmentData } from './segmentData.model';
import { SettingsService } from './../settings.service';
import { SettingsAPIURLService } from './../settings-api-url.service';
import { CommonDataService } from '../../_services/common-data.service';
import { Guid } from 'guid-typescript';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { TableDataSource } from '../../_services/table.datasource';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs/Subject';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';

@Component({
  selector: 'app-edit-segment',
  templateUrl: './edit-segment.component.html',
  styleUrls: ['./edit-segment.component.css']
})
export class EditSegmentComponent implements OnInit {

  SaveSegment: FormGroup;
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  regionList: any[];
  postdata: any;
  MiListProperties: MiProperties = new MiProperties();
  userdetail: any;
  postData: any;
  showLoader: any;
  isError: any;
  errorMessage: any;
  segmentId: any;
  url: any;
  toggleSelect: boolean = false;
  coverageId: any;
  isProductSelected: boolean = false;
  columnLabels: string[] = [
    'Checkbox',
    'Product Name'];

  displayedColumns: string[] = [
    'Checkbox',
    'ProductName'];

  columnIsSortable: string[] = [
    'false',
    'true'];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditSegmentComponent>,
    public sttngSrvc: SettingsService,
    public settingAPIURLService: SettingsAPIURLService,
    public commonService: CommonDataService,
    public getRouterparamter: GetRouteParamtersService,

    @Inject(MAT_DIALOG_DATA) public data: SegmentData
  ) { }

  ngOnInit(): void {

    this.SaveSegment = this.formBuilder.group({
      SegmentName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });

    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.showLoader = true;
    if (this.data.extraData && this.data.extraData.Segment) {
      const segment = this.data.extraData.Segment;
      this.SaveSegment.controls.SegmentName.setValue(segment.SegmentName);
      this.segmentId = segment.SegmentId;
      this.GetProductListUpdate();
      this.GetProductListUpdateParameters(this.segmentId);
    }
    else {
      this.GetProductList();
      this.GetProductListUpdateParameters(this.segmentId);
    }
    this.showLoader = false;
  }

  GetProductListUpdateParameters(segmentId: any) {
    this.postdata = {
      'segmentId': segmentId,
      LicenseeId: this.userdetail["LicenseeId"]
    }
    this.MiListProperties.requestPostData = this.postdata;
    this.MiListProperties.refreshHandler.next(true);
  }

  GetProductList() {
    this.url = this.settingAPIURLService.SettingAPIRoutes.GetProductsWithoutSegments;
    this.MiListProperties.url = this.url;
    this.MiListProperties.miDataSource = new TableDataSource(this.sttngSrvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = false;
    this.MiListProperties.pageSize = this.getRouterparamter.pageSize
    this.MiListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.MiListProperties.isEditablegrid = true;
    this.MiListProperties.isClientSideList = true;
    this.MiListProperties.clientSideSearch = this.searchList;
    this.MiListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, this.IsParameterDefaultValue, '', '', ''),
    }
  }
  GetProductListUpdate() {
    this.url = this.settingAPIURLService.SettingAPIRoutes.GetProductsSegmentsForUpdate
    this.MiListProperties.url = this.url;
    this.MiListProperties.miDataSource = new TableDataSource(this.sttngSrvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = false;
    this.MiListProperties.pageSize = this.getRouterparamter.pageSize
    this.MiListProperties.initialPageIndex = this.getRouterparamter.pageIndex;
    this.MiListProperties.isEditablegrid = true;
    this.MiListProperties.isClientSideList = true;
    this.MiListProperties.clientSideSearch = this.searchList;
    //add true or false for check box check or not in edit section
    this.MiListProperties.fieldType = {
      'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, this.IsFieldDisabled, '', '', ''),
    }
  }

  IsParameterDefaultValue() {
    return true;
  }

  IsFieldDisabled(event) {
     this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
     if (this.userdetail.Permissions[2].Permission === 1) {
       return true;
     } else {
      return !event.IsModifiable;
    }
  }

  OnSellectAllCheckBoxes() {
    this.MiListProperties.miDataSource.tableData.forEach(element => {
       if (element.IsModifiable === true) {
         const newValue = !this.toggleSelect as boolean;
         (element.Checked as boolean) = newValue;
       }
    });
     this.toggleSelect = !this.toggleSelect;
    if (this.MiListProperties.miDataSource.tableData.filter(x => x.Checked === true).length === 0)
    {
      this.isProductSelected = false;
    }
    else
    {
      this.isProductSelected = true;
    }
  }

  OnCheckBoxClicked(value) {
    value.data.Checked = !value.data.Checked;
    this.onDataLoaded(event);
  }

  onDataLoaded(value) {
    if (this.MiListProperties.miDataSource.tableData.filter(x => x.Checked === true).length === 0)
    {
      this.isProductSelected = false;
    }
    else
    {
      this.isProductSelected = true;
    }

    if (this.MiListProperties.miDataSource.tableData.filter(x => x.Checked === true).length === this.MiListProperties.miDataSource.tableData.length) {
      this.toggleSelect = true;
    } else {
      this.toggleSelect = false;
    }
  }

  //---------------method used for hide the validation when user click on cross icon on validation message-----------------------
  OnClosePopup(val: boolean) {

    this.isError = false;
  }
  // *****************************************************************************************************************************

  //-----------------------------Method used for validate a form -------------------------------------------
  OnValidateFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const fieldName = formGroup.get(field);
      if (fieldName instanceof FormControl) {
        fieldName.markAsDirty({ onlySelf: true });
        fieldName.markAsTouched({ onlySelf: true });
      }
    });
  }
  // *****************************************************************************************************************************

  //------------------------------------Method used for save the details of segment--------------------------------------------
  OnSave() {
      let coverageId = '';
      if (this.MiListProperties.miDataSource.tableData && this.MiListProperties.miDataSource.tableData.length > 0) {
        for (const productName of this.MiListProperties.miDataSource.tableData) {
          if (productName.Checked === true) {
            coverageId += productName.CoverageId + ",";
          }
        }
        this.coverageId = coverageId;
        this.coverageId = this.coverageId.substring(0, coverageId.length - 1)
      }


      this.showLoader = true;
      const Id = (this.segmentId) ? this.segmentId : Guid.create().toJSON().value;
      const opnType = (this.segmentId) ? '1' : '0';
      this.postData = {
        'segmentObject': {
          'SegmentId': Id,
          'SegmentName': this.SaveSegment.controls.SegmentName.value.replace(/^\s+|\s+$/gm,''),
          'CoverageId':this.coverageId
        },
        'operationType': opnType,
        LicenseeId: this.userdetail["LicenseeId"]
      };
       this.sttngSrvc.saveDeleteSegment(this.postData).subscribe(response => {
         this.showLoader = false;
         if (response.Status) {
           if (response.Status.IsError) {
             this.isError = true;
             if(response.Status.ErrorMessage === "Segment Name already exist")
             {
               this.errorMessage = response.Status.ErrorMessage;
             }
             else
             {
               if(opnType === '0')
               {
                this.errorMessage = "There is error while inserting segment";
               }
               else if(opnType === '1')
               {
                this.errorMessage = "There is error while updating segment";
               }
               else
               {
                this.errorMessage = "There is error while processing segment";
               }
             }
           }
           else {
             this.dialogRef.close(true);
           }
         }
       });
  }

}
