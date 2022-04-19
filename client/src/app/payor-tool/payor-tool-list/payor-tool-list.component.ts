import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from '../../response.code';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { PayorToolUrlService } from '../payor-tool-url.service'
import { PayorToolService } from '../payor-tool.service'
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataSource } from '../../_services/table.datasource';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddFieldComponent } from '../add-field/add-field.component';
import { Guid } from 'guid-typescript';
import { ResponseErrorService } from '../../_services/response-error.service';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';

import { CopyTemplateComponent } from '../copy-template/copy-template.component';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-payor-tool-list',
  templateUrl: './payor-tool-list.component.html',
  styleUrls: ['./payor-tool-list.component.scss']
})
export class PayorToolListComponent implements OnInit {
  /* Template Lis Variables */
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  columnLabels: string[] = ['Name', ''];
  displayedColumns: string[] = ['TemplateName', 'Action'];
  columnIsSortable: string[] = ['true', 'false'];
  /* Other variables */
  selectedPayorName: any;
  postData: any;
  payorList: any;
  searchData: any;
  userdetail: any;
  postdata: any;
  showloading: Boolean = true;
  payor = new FormControl('', {});
  showLoader: Boolean = false;
  constructor(public commonsvc: CommonDataService,
    public payortoolURLSvc: PayorToolUrlService,
    private payorSvc: PayorToolService,
    private router: Router,
    public dialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public responseError: ResponseErrorService,
    public getrouteParamters: GetRouteParamtersService) { }


  ngOnInit() {
   
    this.getrouteParamters.getparameterslist(this.activatedRoute);
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));

    this.GetPayorList();
  }
  // ************************************************************************************************************************
  /* 
   CreatedBy:Jyotisna
   CreatedOn:Feb14 2020
   Purpose:Method used for getting list of payors for showing in dropdown
   */
  GetPayorList() {
    this.commonsvc.getPayorsList({ 'LicenseeID': this.userdetail['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        this.payorList = response.PayorList;
        if (this.getrouteParamters.payorId) {
       
          this.payor.setValue(this.getrouteParamters.payorId);
         let objPayor= this.payorList.filter(payor => payor['PayorID'] === this.payor.value);
          if (objPayor.length > 0) {
           this.selectedPayorName = objPayor[0].PayorName;
          }
      
        } else {
          this.payor.setValue(this.payorList[0].PayorID);
          this.selectedPayorName = this.payorList[0].PayorName;
        }
        this.InitTemplatesList();
        this.RefreshList();
      }
    });
  }
  // ###############################################################################################################################
  // ************************************************************************************************************************
  /* 
   CreatedBy:Jyotisna
   CreatedOn:Feb14 2020
   Purpose:Method used for getting list of templates 
   */
  InitTemplatesList() {
    this.MiListProperties.url = this.payortoolURLSvc.PayorToolURL.TemplateList
    this.MiListProperties.miDataSource = new TableDataSource(this.payorSvc);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize;
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex;
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Duplicate', 1, true, false, null, 'img-icons duplicate-icn'),
        new MiListMenuItem('Delete', 2, true, false, null, 'img-icons delete-icn')
      ]
  }
  // ###########################################################################################################################################

  // ************************************************************************************************************************
  /* 
   CreatedBy:Jyotisna
   CreatedOn:Feb14 2020
   Purpose:method used for refresh a list based on  changed payor selection
   */
  OnChangePayor(data) {
    this.payor.setValue(data.value);
    this.payorList.filter(item => {
      if (item.PayorID == data.value) {
        this.selectedPayorName = item.PayorName;
      }
    });
    this.RefreshList();
  }
  // ###########################################################################################################################################
  // ************************************************************************************************************************
  /* 
   CreatedBy:Jasine
   CreatedOn:Feb17 2020
   Purpose:method used for create a payor template
   */
  CreateTemplateDialog(): void {
    let dialogRef = this.dialog.open(AddFieldComponent, {
      data: {
        title: 'Add Template',
        fieldName: 'Template Name',
        type: 'Template',
        payor: this.payor.value,
        isPayorImportTemplate: false,
        isForceImport:false
      },
      disableClose: true,
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.MiListProperties.refreshHandler.next(true);
      }
    });
  }
  // ###########################################################################################################################################
  // ************************************************************************************************************************
  /* 
   CreatedBy:Jasine
   CreatedOn:Feb17 2020
   Purpose:method used for refresh a list
   */
  RefreshList() {
    this.postData = {
      'payorId': this.payor.value,
      'FilterBy': this.searchData
    }
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
    this.showloading = false;
  }
  // ###########################################################################################################################################
  // ************************************************************************************************************************
  /* 
   CreatedBy:Jasine
   CreatedOn:Feb17 2020
   Purpose:method used for action to take on  menu item clicks 
   */
  OnMenuItemClick(value) { // 
    if (value.name === 'Edit' || value.name === 'row-click') {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['payor-tool/payor-tool-settings', this.payor.value, value.data.TemplateID, this.selectedPayorName, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
    else if (value.name === 'Delete') {
      this.OnDeleteTemplate(value.data.TemplateID);
    }
    else if (value.name === 'Duplicate') {
      let postdata = {
        'sourcePayorId': this.payor.value,
        'sourceTemplateId': value.data.TemplateID
      } 
      this.showloading = true;
      //Check if valid to be duplicated
      this.payorSvc.checkIfTemplateHasFields(postdata).subscribe(response =>{
          this.showloading = false;
          if(response.BoolFlag === true){
          this.OnDuplicateTemplate(value.data.TemplateID);
          }
          else{
            this.dialog.open(RemoveConfirmationComponent, {
              data: {
                headingTitle: 'Invalid selection!',
                subTitle: 'Selected template has no data to be duplicated.',
                forceToDelete:false
              },
              width: '400px',
              disableClose: true,
            });
          }

      })
    }
  }
  // ##################################################################################################################################
  // *****************************************************************************************************************************
  /*
   Created By:Jasmine
  Createdon:Feb18,2020
  Purpose:Duplicate a payor template 
  */
  OnDuplicateTemplate(templateId): void {
    let dialogRef = this.dialog.open(CopyTemplateComponent, {
      data: {
        title: 'Copy Template',
        fieldName: 'Payor',
        fieldName2: 'Template',
        subTitle: 'Select the payor and template you want to copy.',
        copy: 'Copy',
        cancel: 'Cancel',
        PayorList: this.payorList,
      },
      disableClose: true,
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // 
        this.showLoader = true;
        let postdata = {
          'sourcePayorId': this.payor.value,
          'sourceTemplateId': templateId,
          'destinationPayorId': result.PayorName.value,
          'destinationTemplateId': result.TemplateName.value
        }
        this.payorSvc.duplicateTemplate(postdata).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
        });
      }
    });
  }
  // ##############################################################################################################################
  // *****************************************************************************************************************************
  /*
    Created By:Jasmine
   Createdon:Feb18,2020
   Purpose:Delete a payor template 
   */
  OnDeleteTemplate(templateId: string) {
    const dilogref = this.dialog.open(ShowConfirmationComponent, {
      data: {
        headingTitle: 'Delete',
        subTitle: 'Are you sure you want to delete the selected template?'
      },
      width: '400px',
      disableClose: true,
    });
    dilogref.afterClosed().subscribe(result => {
      if (result == true) {
        this.showLoader = true;
        let postdata = {
          'payorId': this.payor.value,
          'templateId': templateId,
        }
        this.payorSvc.DeleteTemplate(postdata).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            this.responseError.OpenResponseErrorDilog(response.Message);
          }
        });
      }
    });
  }
  // #############################################################################################################################

  // *****************************************************************************************************************************
  /*
    Created By:Ankit Khandelwal
   Createdon:Feb19,2020
   Purpose:Search a template by searching parameter
   */
  doSearch() {
    this.MiListProperties.initialPageIndex=0;
    this.MiListProperties.resetPagingHandler.next(true);
    this.RefreshList();
  }

  HandleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.doSearch();
    } else if (value.type === 'click') {
      this.searchData = '';
      this.doSearch();
    }
  }
  OnPaginationChange(pageDetails) {
    console.log(pageDetails);
    this.getrouteParamters.pageIndex = pageDetails.nextIndex;
    this.getrouteParamters.pageSize = pageDetails.newPageSize;

}


}
