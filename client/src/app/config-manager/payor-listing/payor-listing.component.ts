// Modified By: Ankit khandelwal
// Modified on: 13-08-2019
// Total Number of methods:8
import { Component, OnInit } from '@angular/core';
import { MiProperties } from '../../shared/mi-list/mi-properties'
import { TableDataSource } from '../../_services/table.datasource';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service'
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { Subject } from 'rxjs';
import { EditPayorComponent } from '../edit-payor/edit-payor.component';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'
import { ResponseErrorService } from '../../_services/response-error.service';
import { ResponseCode } from '../../response.code';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';

@Component({
  selector: 'app-payor-listing',
  templateUrl: './payor-listing.component.html',
  styleUrls: ['./payor-listing.component.scss']
})
export class PayorListingComponent implements OnInit {
  //----------------------Variable Initalize-----------------------------------------------
  title: any;
  MiListProperties: MiProperties = new MiProperties();
  url: any;
  dataToPost: any;
  searchData: any;
  userdetail: any;
  showloading: Boolean = false;
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  columnLabels: string[] = [
    'Payor Name',
    'Nickname',
    'Type',
    'Status',
    'Region',
    ''];

  displayedColumns: string[] = [
    'PayorName',
    'NickName',
    'Type',
    'Status',
    'Region',
    'Action'];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'true',
    'false'];
  // ********************************************************************************************
  constructor(
    private router: Router,
    public getrouteParamters: GetRouteParamtersService,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public error: ResponseErrorService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.title = 'Configuration Manager';
    this.InitPayorsList();
    this.RefreshList();
  }
  //---------------------------------- this method is used for getting list of payors----------------------------------
  InitPayorsList() {
    this.url = this.configAPIURLService.ConfigAPIRoute.GetPayorsListing
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.configService);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex
    this.MiListProperties.initialSortBy = 'PayorName'
    this.MiListProperties.initialSortOrder = 'asc'

    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Carriers', 1, true, false, null, 'img-icons carrier-icn'),
        new MiListMenuItem('Contacts', 1, true, false, null, 'img-icons contact-icn'),
        new MiListMenuItem('Delete', 1, true, false, null, 'img-icons delete-icn')
      ]

  }
  // **********************************************************************************************************************
  //-------------------------Method used for sending a filter parameter for filtered payor list---------------------------
  RefreshList() {
    this.dataToPost = {
      'FilterBy': this.searchData
    }
    this.MiListProperties.requestPostData = this.dataToPost;
    this.MiListProperties.refreshHandler.next(true);
  }
  // **********************************************************************************************************************
  //-------------------------Method used for searching based on search ---------------------------------------------------
  doSearch() {
    //this.showLoading = false;
    this.MiListProperties.resetPagingHandler.next(true);
    this.RefreshList()
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
  // **********************************************************************************************************************

  //-------------------------Method used for shown a Edit/Add payor dialog box ---------------------------------------------------
  OnCreateClick(val) {
    const title = (val) ? 'Edit Payor' : 'Create Payor';
    const buttonText = (val) ? 'Update' : 'Create';
    const dialogRef = this.dialog.open(EditPayorComponent, {
      data: {
        headingTitle: title,
        subTitle: '',
        primaryButton: buttonText,
        secondryButton: 'Cancel',
        extraData: {
          'Payor': val
        },
      },
      disableClose: true,

    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.searchData = '';
        this.RefreshList();
      }
    });
  }
  // **********************************************************************************************************************


  //-------------------------Method used for take neccessary action on action button click of a record ---------------------------------------------------
  OnMenuClicked(value) {
    if (value.name === 'Edit') {
      this.OnCreateClick(value.data);
    }
    else if (value.name === 'Contacts') {
      this.router.navigate(['config-manager/payor-contacts', value.data.PayorID, 3, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
    else if (value.name === 'Carriers') {
      this.router.navigate(['config-manager/carrier-listing', value.data.PayorID, 2, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
    else if (value.name === 'Delete') {
      this.showloading = true;
      const postData = {
        'payorObject': {
          'PayorID': value.data.PayorID,
          'PayorName': value.data.PayorName,
          'NickName': value.data.NickName,
          'StatusID': value.data.StatusID
        },
        'operationType': '2',
        'forceDelete': false
      };
      this.configService.saveDeletePayor(postData).subscribe(response => {
        this.showloading = false;
        if (response['ResponseCode'] === ResponseCode.SUCCESS) {
          this.OnDeletePayorDialogBox(value);
        }
        else {
          const msg = (response.Status) ? response.Status.ErrorMessage : response.Message;
          this.OnPayorHasPoliciesDialogBox();
          return;
        }
      });
    }
  }
  // **********************************************************************************************************************

  //-------------------------Methods used for delete a payor----------- ---------------------------------------------------
  OnPayorHasPoliciesDialogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Delete Payor',
        subTitle: 'Payor cannot be deleted as there are either payor tool settings or policies associated with payor in the system.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
  }
  OnDeletePayorDialogBox(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Payor',
        subTitle: 'Are you sure you want to delete this payor?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        const postData = {
          'payorObject': {
            'PayorID': value.data.PayorID,
            'PayorName': value.data.PayorName,
            'NickName': value.data.NickName,
            'StatusID': value.data.StatusID
          },
          'operationType': '2',
          'forceDelete': true
        };
        this.configService.saveDeletePayor(postData).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          }
        });

      }
    });
  }
  // **********************************************************************************************************************

}
