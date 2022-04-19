import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { TableDataService } from '../../_services/table-data.service';
import { TableDataSource } from '../../_services/table.datasource';
import { AppLevelDataService } from '../../_services/app-level-data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { ResponseCode } from '../../response.code'
import { PeoplemanagerService } from '../peopleManager.service';
import { PeopleManagerAPIUrlService } from '../people-manager-url.service';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { ResponseErrorService } from '../../_services/response-error.service';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-user-mapping',
  templateUrl: './user-mapping.component.html',
  styleUrls: ['./user-mapping.component.scss']
})
export class UserMappingComponent implements OnInit {
  filterStatus: any;
  filterData = false;
  filterParameter: any;
  showloading: boolean;
  toggleSelect = false;
  isSelectAll: boolean;
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  url: any;
  buttonClicked: boolean;
  getlicenseeId: any;
  searchData = '';
  roleId: any;
  isUpdatebuttonclicked: boolean;
  userdetail: any;
  usercredentialId: any;
  datatopost: any;
  isCheckboxDisabled: boolean;
  pageSize: any; // page size for getting list based on pagesize
  pageIndex: any; // page index for getting list based on pageindex
  previousURL: any; // showing previous url
  parentURL: any; // showing parent Url
  getLoggedInUserDetails: any;
  dataList = [];
  existingList: any[];
  hasMatch: boolean;
  moduleName: string;
  pagename: string;
  postdata: any;
  isleavePopupshown: boolean;
  showNickName: any;
  isChangesInListing: boolean;
  searchEnteredClick: Boolean = false;
  columnLabels: string[] = [
    'Checkbox',
    'Nickname',
    'First Name',
    'Last Name',
    'Email',
    'Created Date']

  displayedColumns: string[] = [
    'CheckBox',
    'NickName',
    'FirstName',
    'LastName',
    'Email',
    'CreatedDate'];

  columnIsSortable: string[] = [
    'false',
    'true',
    'true',
    'true',
    'true',
    'true'];

  @ViewChild('searchService',{ static: true }) private refSearch: MatInput
  @Output() onAfterDataLoaded = new EventEmitter<object>(); // this can we emit for getting response when from loaddata
  constructor(public dialog: MatDialog,
    private appData: AppLevelDataService,
    private activateroute: ActivatedRoute,
    private router: Router,
    private _tableDataService: TableDataService,
    public peoplemanagerUrlService: PeopleManagerAPIUrlService,
    public peopleMangerSvc: PeoplemanagerService,
    public getrouteParamters: GetRouteParamtersService,
    public getErrorResponse: ResponseErrorService) {
    this.url = peoplemanagerUrlService.PeoplemanagerAPIRoute.UsermappingListing
    this.MiListProperties.miDataSource = new TableDataSource(this.peopleMangerSvc)
    this.MiListProperties.url = this.url
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.initialSortBy = 'NickName';
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = false;
    this.MiListProperties.miListMenu.visibleOnMob = true;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.resetPagingHandler = this.needPageReset;

  }

  ngOnInit() {
    this.refSearch.focus();
    this.isChangesInListing = false;
    this.buttonClicked = false;
    this.isUpdatebuttonclicked = false;
    this.moduleName = 'People Manager';
    this.pagename = 'Edit profile'
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.filterParameter = ''
    this.activateroute.params.subscribe(params => {
      this.usercredentialId = params['usercredentialId'],
        this.pageSize = params['pageSize'],
        this.pageIndex = params['pageIndex']
    });
    this.getLoggedInUserDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.isCheckboxDisabled = this.getLoggedInUserDetails.Permissions[0].Permission === 1 ? true : false;
    this.isleavePopupshown = this.getLoggedInUserDetails.Permissions[0].Permission === 1 ? true : false;
    this.postdata = {
      'userCredentialId': this.getrouteParamters.userCredentialId
    }
    this.peopleMangerSvc.getagentdetails(this.postdata).subscribe((response) => {
      if (response['ResponseCode'] === ResponseCode.SUCCESS) {
        this.showNickName = '-' + ' ' + response.UserObject.NickName;
        this.roleId = response.UserObject.Role;
      }
    });
    this.getpostdata();
  }
  /*
  Method to send update call to API to save user mapping
  */
  onLinkedUserUpdate() {
    this.buttonClicked = true;
    this.showloading = true;
    this.existingList = JSON.parse(localStorage.getItem('linkedUsers')); // localStorage.getItem('linkedUsers')["dataList"];
    // Check current page for any changes
    this.isUpdatebuttonclicked = true;
    if (this.existingList) {
      this.existingList = this.existingList['dataList'];
      for (let index = 0; index < this.existingList.length; index++) {
        if (this.existingList[index]) {
          let innerList = []
          innerList = this.existingList[index]['data'];
          if (innerList && innerList.length > 0) {
            for (let i = 0; i < innerList.length; ++i) {
              this.dataList.push(innerList[i]);
            }
          }
        }
      }
    }
    for (let j = 0; j < this.MiListProperties.miDataSource.tableData.length; j++) {
      this.dataList.push(this.MiListProperties.miDataSource.tableData[j]);
    }
    this.datatopost = {
      'loggedInUserId': this.usercredentialId,
      'linkedUserList': this.dataList
    }
    this.peopleMangerSvc.addUpdateLinkedUserList(this.datatopost).subscribe(response => {
      this.clearStorage();
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        // this.router.navigate([this.parentURL.ParentRoute], { queryParams: { 'pageSize': this.pageSize, 'pageIndex': this.pageIndex } });
        this.OnRedirectionToPage();
        this.OpenUpdateAgentdilog(response.Message);

        this.MiListProperties.refreshHandler.next(true);
      } else {
        this.getErrorResponse.OpenResponseErrorDilog(response.Message);
      }

    });
  }
  OnPageRedirection(value) {
    if (value.data.url.indexOf('people/CreateNewAgent') > -1) {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['people/Agentlisting', '1', '10', '0']);
    } else if (value.data.url.indexOf('people/CreateNewUser') > -1) {
      this.router.navigate(['people/Userlisting', '2', '10', '0']);
    } else {
      if (value.data.parentTab === '1') {
        // tslint:disable-next-line:max-line-length
        this.router.navigate(['people/Agentlisting', this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
      } else {
        // tslint:disable-next-line:max-line-length
        this.router.navigate(['people/Userlisting', this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
      }
    }
  }
  // -------------------------------------------------------- This function used for Select Checkbox----------------------------------------
  oncheckedvaluecheck(event) {
    if (this.getLoggedInUserDetails.Permissions[0].Permission === 2) {
      this.isChangesInListing = true;
      if (event.data.CheckBox.FormattedValue === false) {
        event.data.IsConnected = true
      } else {
        event.data.IsConnected = false
      }
      event.data.CheckBox.FormattedValue = !event.data.CheckBox.FormattedValue
    }
    this.onDataLoaded(event);
  }
  // ######################################################################################################################################
  // -------------------------------------------------- This function used for Select All Checkbox----------------------------------------
  onSelectAll(value) {
    if (this.getLoggedInUserDetails.Permissions[0].Permission === 2) {
      this.isChangesInListing = true;
      this.MiListProperties.miDataSource.tableData.forEach(element => {
        if (element && this.isObject(element['CheckBox'])) {
          (element['IsConnected'] as boolean) = !this.toggleSelect as boolean
          (element['CheckBox']['FormattedValue'] as boolean) = !this.toggleSelect as boolean
        }
      });
      this.toggleSelect = !this.toggleSelect;
    } else {
    }

  }
  OnPageinationChange(value) {
    this.getrouteParamters.pageIndex = value.nextIndex;
    this.getrouteParamters.pageSize = value.newPageSize
  }
  // ######################################################################################################################################
  // ------------------------------------- This function used for check wheateher filed is object or not-----------------------------------
  isObject(val) {
    if (val == null) {
      return false;
    } else {
      return typeof val === 'object';
    }
  }
  onDataLoaded(value) {
    // tslint:disable-next-line:max-line-length
    if (this.MiListProperties.miDataSource.tableData.filter(x => x.IsConnected === true).length === this.MiListProperties.miDataSource.tableData.length) {
      this.toggleSelect = true;
    } else {
      this.toggleSelect = false;
    }
  }
  // ######################################################################################################################################
  /*
  Author: Jyotisna
  Created On: Dec 27, 2018
  Purpose: Event emitted from child to make any change on sort change
  */
  sortChanged(event) {
    this.clearStorage();
  }
  /*
  Author: Jyotisna
  Created On: Dec 24, 2018
  Purpose: Event emitted from child to make any change on page change
   */
  pageChanged(event) {
    /* Check if page size changed, then clear storage and return */
    if (event.pageSize !== event.newPageSize) {
      this.clearStorage(); return;
    }
    // On page change, first render next/previous page from cache, if exists
    this.existingList = JSON.parse(localStorage.getItem('linkedUsers')); // localStorage.getItem('linkedUsers')["dataList"];
    if (this.existingList) {
      this.existingList = this.existingList['dataList'];
      {
        this.hasMatch = false;
        // check if indedx already exists
        for (let index = 0; index < this.existingList.length; index++) {
          if (this.existingList[index]) {
            const id = this.existingList[index]['index'];
            if (id === event.nextIndex) {
              this.hasMatch = true;
              break;
            }
          }
        }
      }
      if (this.hasMatch === true) {
        this.MiListProperties.cachedList = this.existingList[event.nextIndex]['data'];
      } else {
        this.MiListProperties.cachedList = null;
      }
    }

    //  Now, whichever page is left - save page's data into local storage
    if (event && event.data /*&& event.data.length > 0*/) {
      // Get incoming data as list
      const list = []
      for (let i = 0; i < event.data.length; i++) {
        list.push(event.data[i]);
        // list.push(event.data[i]['UserCredentialID']);
      }

      // check existing list if present
      this.existingList = JSON.parse(localStorage.getItem('linkedUsers')); // localStorage.getItem('linkedUsers')["dataList"];
      if (this.existingList) {
        this.existingList = this.existingList['dataList'];
        if (this.existingList && this.existingList.length > 0) {
          this.hasMatch = false;
          // check if indedx already exists
          for (let j = 0; j < this.existingList.length; j++) {
            if (this.existingList[j]) {
              const id = this.existingList[j]['index'];
              if (id === event.index) {
                this.hasMatch = true;
                break;
              }
            }
          }
          // Match found, update index with updated page values
          if (this.hasMatch === true) {
            this.existingList[event.index]['data'] = list;
          } else { // New entry - add to cache
            const obj = { 'index': event.index, 'data': list }
            this.existingList.push(obj)
          }
          localStorage.setItem('linkedUsers', JSON.stringify({ 'dataList': this.existingList }));
        }

      } else {
        const dataList = []
        const obj = { 'index': event.index, 'data': list }
        dataList.push(obj)
        localStorage.setItem('linkedUsers', JSON.stringify({ 'dataList': dataList }));
      }
    }
  }

  getpostdata() {
    this.datatopost = {
      'userCredentialId': this.usercredentialId,
      'FilterBy': this.filterParameter
    }
    this.MiListProperties.resetPagingHandler.next(true);
    this.MiListProperties.requestPostData = this.datatopost;
    this.MiListProperties.refreshHandler.next(true);
  }

  /*
  Method called on search
  */
  applyFilter() {
    this.searchEnteredClick = true;
    this.clearStorage();
    const dataSearch = true;
    if (dataSearch) {
      this.filterParameter = this.filterStatus
    } else {
      this.filterParameter = ''
    }
    this.getpostdata();
  }

  /*
  Method called when search parameters are cleared
  */
  handleSearchClear = (value) => {
    this.searchEnteredClick = false;
    if (!value) {
      this.filterStatus = value;
      this.applyFilter();
    } else if (value.type === 'click') {
      this.filterStatus = '';
      this.applyFilter();
    }
  }
  OnbuttonCancel() {
    this.buttonClicked = true;
    this.OnRedirectionToPage();
    this.clearStorage();
  }

  // @HostListener('window:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   const key = event.keyCode;
  //   console.log(this.filterStatus)
  //   if (key === 13) {
  //     if (this.getLoggedInUserDetails.Permissions[0].Permission === 2) {
  //       this.onLinkedUserUpdate();

  //     }
  //   }
  // }
  OnRedirectionToPage() {
    if (this.getrouteParamters.parentTab === '1') {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['people/Agentlisting', this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    } else {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['people/Userlisting', this.getrouteParamters.parentTab, this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex]);
    }
  }

  /*
  Method to clear local storage of saved mapping and page index across pages
  */
  clearStorage() {
    localStorage.removeItem('linkedUsers');
    localStorage.removeItem('pageIndex');
    this.MiListProperties.cachedList = null;
  }


  OpenUpdateAgentdilog(Message: string) {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      width: '450px',
      data: {
        Title: this.roleId === 3 ? 'Agent Details Updated successfully' : ' User Details Updated successfully',
        subTitle: Message,
        buttonName: 'ok',
        isCommanFunction: false
      },
      disableClose: true,
    });
  }
}
