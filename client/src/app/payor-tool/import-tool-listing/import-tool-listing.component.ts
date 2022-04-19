
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from '../../response.code';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { PayorToolUrlService } from '../payor-tool-url.service';
import { PayorToolService } from '../payor-tool.service';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataSource } from '../../_services/table.datasource';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddFieldComponent } from '../add-field/add-field.component';
import { ShowConfirmationComponent } from '../../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { CopyTemplateComponent } from '../copy-template/copy-template.component';

@Component({
  selector: 'app-import-tool-listing',
  templateUrl: './import-tool-listing.component.html',
  styleUrls: ['./import-tool-listing.component.scss']
})
export class ImportToolListingComponent implements OnInit {

  showloading: Boolean = true;
  showLoader: Boolean = false;
  payorList: any;
  selectedPayorName: any;
  userdetail: any;
  searchData: any;
  postData: any;
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  columnLabels: string[] = ['Name', ''];
  displayedColumns: string[] = ['TemplateName', 'Action'];
  columnIsSortable: string[] = ['true', 'false'];
  payor = new FormControl('', {});

  constructor(private router: Router,
    public commonsvc: CommonDataService,
    public getrouteParamters: GetRouteParamtersService,
    public activatedRoute: ActivatedRoute,
    public payortoolURLSvc: PayorToolUrlService,
    private payorSvc: PayorToolService,
    public dialog: MatDialog) { }




  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.getrouteParamters.getparameterslist(this.activatedRoute);
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayorList();
  }

  // ********************************************Method Use For  Payor List****************************************************** */
  // tslint:disable-next-line:typedef
  GetPayorList() {
    this.commonsvc.getPayorsList({ 'LicenseeID': this.userdetail['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        this.payorList = response.PayorList;

        if (this.getrouteParamters.payorId) {
          this.payor.setValue(this.getrouteParamters.payorId);
          let objPayor = this.payorList.filter(payor => payor['PayorID'] === this.payor.value);
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

  // // *********************************************************************************************** */
  // /*
  // purpose:Method Used on changing payor
  // */
  OnChangePayor(data) {
    this.payor.setValue(data.value);
    this.payorList.filter(item => {
      if (item.PayorID === data.value) {
        this.selectedPayorName = item.PayorName;
      }
    });
    this.RefreshList();
  }


  // // *********************************************Getting Template List**************************************************** */
  InitTemplatesList() {
    this.MiListProperties.url = this.payortoolURLSvc.PayorToolURL.TemplateList;
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
        new MiListMenuItem('View', 0, true, false, null, 'img-icons view-icn'),
        new MiListMenuItem('Edit', 1, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Duplicate', 2, true, false, null, 'img-icons duplicate-icn'),
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn'),

      ]

  }

  // // ************************************************************************************************** */
  // /*
  //  Purpose:method used for refresh a list
  // */
  RefreshList() {
    this.postData = {
      'payorId': this.payor.value,
      'selectedTabName': 'ImportToolTemplate',
      'FilterBy': this.searchData,
    };
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
    this.showloading = false;
  }
  // // *************************************************************************************************************************** */
  // /*
  // Purpose:method used for action to take on  menu item clicks 
  // */
  OnMenuItemClick(value) {
    if (value.name == 'Edit') {
      this.AddUpdateTemplateDialog(value.data)
    } else if (value.name === 'Delete') {
      this.OnDeleteTemplate(value.data.TemplateID);
    } else if (value.name === 'Duplicate') {
      this.OnDuplicateTemplate(value.data.TemplateID);
    } else if (value.name === 'View' || value.name === 'row-click') {

      this.router.navigate(['payor-tool/payor-tool-import-settings',
        this.payor.value, value.data.TemplateID, this.getrouteParamters.pageSize,
        this.getrouteParamters.pageIndex]);
    }
  }
  // tslint:disable-next-line:typedef
  OnPaginationChange(pageDetails) {
    console.log(pageDetails);
    this.getrouteParamters.pageIndex = pageDetails.nextIndex;
    this.getrouteParamters.pageSize = pageDetails.newPageSize;

  }
  // // ******************************************************************************************* */
  // /*
  // Purpose:method used for create a payor template
  // */
  AddUpdateTemplateDialog(templateData) {
    let dialogRef = this.dialog.open(AddFieldComponent, {
      data: {
        title: templateData && templateData.TemplateID ? 'Edit Template' : 'Add Template',
        fieldName: 'Template Name',
        type: 'Template',
        payor: this.payor.value,
        isForceImportShown: true,
        forceImport: templateData && templateData.IsForceImport ? templateData.IsForceImport : false,
        isPayorImportTemplate: true,
        templateName: templateData && templateData.TemplateName ? templateData.TemplateName : '',
        templateId: templateData && templateData.TemplateID ? templateData.TemplateID : '',
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
  // ******************************************************************************************** */
  /*
  Purpose:Delete a payor template 
  */
  OnDeleteTemplate(templateId) {
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
          'templateId': templateId,
        }
        const url = this.payortoolURLSvc.ImportPayorToolURL.DeleteTemplateField
        this.payorSvc.RequestSendsToServer(postdata, url).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          }
        });
      }
    });
  }
  // // ********************************************************************************************** */
  // // tslint:disable-next-line:typedef
  // /*
  // purpose:Duplicate a payor template
  // */
  OnDuplicateTemplate(templateId) {
    let dialogRef = this.dialog.open(CopyTemplateComponent, {
      data: {
        title: 'Copy Template',
        fieldName: 'Payor',
        fieldName2: 'Template',
        subTitle: 'Select the payor and template you want to copy.',
        copy: 'Copy',
        cancel: 'Cancel',
        PayorList: this.payorList,
        selectedTabName: 'ImportToolTemplate'
      },
      disableClose: true,
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader = true;
        let postdata = {
          'sourcePayorId': this.payor.value,
          'sourceTemplateId': templateId,
          'destinationPayorId': result.PayorName.value,
          'destinationTemplateId': result.TemplateName.value,
        };
        postdata['URL'] = 'DuplicateImportToolTemplate';
        this.commonsvc.RequestSendsToAPI(postdata).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          } else {
            //this.responseError.OpenResponseErrorDilog(response.Message);
          }
        });
      }
    });
  }
  // **************************************************************************************** */
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
}

