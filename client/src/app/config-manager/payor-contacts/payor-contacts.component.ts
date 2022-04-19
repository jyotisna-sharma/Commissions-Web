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
import { ResponseErrorService } from '../../_services/response-error.service';
import { ResponseCode } from '../../response.code';
import { CommonDataService } from '../../_services/common-data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component'

@Component({
  selector: 'app-payor-contacts',
  templateUrl: './payor-contacts.component.html',
  styleUrls: ['./payor-contacts.component.scss']
})
export class PayorContactsComponent implements OnInit {
  MiListProperties: MiProperties = new MiProperties();
  url: any;
  dataToPost: any;
  searchData: any;
  userdetail: any;
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  payorList: any;
  title: any;
  payor = new FormControl('', {});
  showLoading: Boolean = false;
  isPayorListFound: boolean = false;
  columnLabels: string[] = [
    'First name',
    'Last name',
    'Contact Preference',
    'Email',
    'Priority',
    ''];

  displayedColumns: string[] = [
    'FirstName',
    'LastName',
    'ContactPref',
    'Email',
    'Priority',
    'Action'];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'true',
    'false'];

  constructor(
    private router: Router,
    public getrouteParamters: GetRouteParamtersService,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public error: ResponseErrorService,
    public commonsvc: CommonDataService,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.title = 'Configuration Manager';
    this.getrouteParamters.getparameterslist(this.activateRoute);
    this.showLoading = true;
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayorList();
    // this.initContactsList();
    // this.refreshList();
  }

  initContactsList() {
    this.url = this.configAPIURLService.ConfigAPIRoute.GetPayorContacts
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
    this.MiListProperties.initialSortBy = 'FirstName'
    this.MiListProperties.initialSortOrder = 'asc'

    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 1, true, false, null, 'img-icons delete-icn')
      ]
    // this.MiListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
    //   if (isloadingDone && isloadingDone.length > 0) {

    //   }
    // });

  }

  refreshList() {

    this.dataToPost = {
      // 'LicenseeId': this.userdetail['LicenseeId'],
      // 'statusId': this.getrouteParamters.parentTab,
      'PayorId': this.payor.value,
      'FilterBy': this.searchData
    }

    this.MiListProperties.requestPostData = this.dataToPost;
    this.MiListProperties.refreshHandler.next(true);
    // this.MiListProperties.resetPageToZero = false;
  }

  /* Search Methods  */
  doSearch() {
    //this.showLoading = false;
    this.MiListProperties.resetPagingHandler.next(true);
    this.refreshList()
  }

  handleSearchClear = (value) => {
    if (!value) {
      this.searchData = value;
      this.doSearch();
    } else if (value.type === 'click') {
      this.searchData = '';
      this.doSearch();
    }
  }

  OnCreateClick() {
    this.router.navigate(['config-manager/add-payor-contact', this.payor.value, 3, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
  }
  GetPayorList() {
    //this.showLoader = true;

    this.commonsvc.getPayorsList({ 'LicenseeID': this.userdetail && this.userdetail['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        //  this.showLoader = false;
        this.showLoading = false;
        this.isPayorListFound = true;
        this.payorList = response.PayorList;
        if (this.getrouteParamters.payorId) {
          this.payor.setValue(this.getrouteParamters.payorId);
        }
        else {
          this.payor.setValue(this.payorList[0].PayorID);
        }
        this.initContactsList();
        this.refreshList();
      }

    });
  }

  OnChangePayor(data) {
    this.payor.setValue(data.value);
    this.refreshList();
  }

  OnMenuClicked(value) {
    if (value.name === 'Delete') {

      this.OnDeletePayorContact(value);
    } else if (value.name === 'Edit') {

      this.router.navigate(['config-manager/edit-payor-contact', this.payor.value, value.data.PayorContactId, 3, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
  }
  OnDeletePayorContact(value) {
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Payor Contact',
        subTitle: ' Are you sure you want to delete this payor contact?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {

        //this.show= true;
        const postData = {
          'contactID': value.data.PayorContactId
        };

        this.configService.DeletePayorContact(postData).subscribe(response => {
          if (response['ResponseCode'] === ResponseCode.SUCCESS) {
            this.MiListProperties.refreshHandler.next(true);
          }
          else {
            const msg = (response.Status) ? response.Status.ErrorMessage : response.Message;
            this.error.OpenResponseErrorDilog(msg);
            return;
          }
        });
      }
    })
  }
  OnPaginationChange(data) {

  }
}
