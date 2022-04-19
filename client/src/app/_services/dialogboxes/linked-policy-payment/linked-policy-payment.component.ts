import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MiProperties } from '../../../shared/mi-list/mi-properties';
import { MiListMenu } from '../../../shared/mi-list/mi-list-menu';
import { TableDataSource } from '../../table.datasource';
import { CommonDataService } from '../../common-data.service';
import { Subject } from 'rxjs/Subject';
import { GetRouteParamtersService } from '../../getRouteParamters.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ActivatedRoute, Router } from '@angular/router';
import { MiListFieldType } from 'src/app/shared/mi-list/mi-list-field-type';
import { LinkedPolicyData } from '../linked-policy-payment/linked-policy-listing.model';
import { MiListMenuItem } from '../../../shared/mi-list/mi-list-menu-item';
import { ResponseCode } from '../../../response.code';
import { CompManagerService } from '../../../comp-manager/comp-manager.service';
@Component({
  selector: 'app-linked-policy-payment',
  templateUrl: './linked-policy-payment.component.html',
  styleUrls: ['./linked-policy-payment.component.scss']
})
export class LinkedPolicyPaymentComponent implements OnInit {

  userDetails: any;
  MiListProperties: MiProperties = new MiProperties();
  SecondListProperties: MiProperties = new MiProperties();
  lastSelectedTr: any;
  postdata: any;
  needPageReset: Subject<boolean> = new Subject();
  needRefreshFirstList: Subject<boolean> = new Subject();
  needRefreshSecondList: Subject<boolean> = new Subject();
  searchList: Subject<boolean> = new Subject();
  accordionPanelList: MiProperties = new MiProperties();
  accordionPanelNeedRefresh: Subject<boolean> = new Subject();
  isaccordionPanelShow: Boolean = false;
  listingURL: any;
  dialogData: any;
  dataTopost: any;
  dataPassing: any;
  lastSelectedClass: any;
  isCountHiden: Boolean = false;
  listPassing: any = [];
  isSecondListShown: Boolean = false;
  DataFilter: any;
  payorList: any;
  selectedRow: any;
  defaultPayorID: any;
  isSearchNotShown: Boolean = false;
  toggleSelect = false;
  searchData: any;
  isdisabled: any;
  getlistData: any;
  clients: any;
  self: any;
  showloading: Boolean;
  totalCount: any;
  defaultSelectedValue: boolean;
  firstDateofMonth: any;
  filters = new FormGroup({
    Payor: new FormControl('', []),
    Client: new FormControl('', [])
  });
  constructor(
    public CommanDataSvc: CommonDataService,
    public getrouteParamters: GetRouteParamtersService,
    @Inject(MAT_DIALOG_DATA) public data: LinkedPolicyData,
    public dialogRef: MatDialogRef<LinkedPolicyPaymentComponent>,
    public activatedRoute: ActivatedRoute,
    public route: Router,
    public compManagerService: CompManagerService
  ) {
    this.dialogData = this.data;
    this.self = this;
  }

  ngOnInit() {
  }
}
    //   this.showloading = true;
    //   this.userDetails = JSON.parse(localStorage.getItem('loggedUser'));

    //   this.initList();
    //   this.refreshList();
    //   if (this.data.isSecondListShown) {
    //     this.data.secondGridData.cachedList[0].show = true;
    //     this.SecondListData();
    //     this.RefreshSecondListData();
    //   }
    //   this.GetClientList();
    //   this.GetPayorList();
    // }
    // OnClosePopup() {
    //   this.dialogRef.close(false);
    // }
    // GetClientList() {
    //   const userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    //   this.postdata = {
    //     'licenseeId': userdetails.LicenseeId,
    //   }
    //   this.CommanDataSvc.getAllClientName(this.postdata).subscribe(response => {
    //     if (response.ResponseCode === ResponseCode.SUCCESS) {
    //       this.clients = response.ClientList;
    //       this.filters.controls.Client.setValue(this.clients[0].ClientId);
    //     }

    //   });
    // }
    // GetPayorList() {
    //   const userdetails = JSON.parse(localStorage.getItem('loggedUser'));
    //   this.CommanDataSvc.getPayorsList({ 'LicenseeID': userdetails['LicenseeId'] }).subscribe(response => {
    //     if (response.ResponseCode === ResponseCode.SUCCESS) {
    //       this.payorList = response.PayorList;
    //       this.filters.controls.Payor.setValue(this.payorList[0].PayorID);
    //     }
    //   });
    // }
    // initList() {
    //   this.MiListProperties.url = this.data.listingURL;
    //   this.MiListProperties.miDataSource = new TableDataSource(this.CommanDataSvc);
    //   this.MiListProperties.displayedColumns = this.data.displayedColumns;
    //   this.MiListProperties.columnLabels = this.data.columnLabels;
    //   this.MiListProperties.columnIsSortable = this.data.columnIsSortable;
    //   this.MiListProperties.refreshHandler = this.needRefreshFirstList;
    //   this.MiListProperties.miListMenu = new MiListMenu();
    //   this.MiListProperties.miListMenu.visibleOnDesk = true;
    //   this.MiListProperties.miListMenu.visibleOnMob = false;
    //   this.MiListProperties.showPaging = this.data.showPaging;
    //   this.MiListProperties.resetPagingHandler = this.needPageReset;
    //   this.MiListProperties.pageSize = this.getrouteParamters.pageSize;
    //   this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex;
    //   this.MiListProperties.isClientSideList = this.data.isClientSideList;
    //   this.MiListProperties.clientSideSearch = this.searchList;
    //   this.MiListProperties.isEditablegrid = this.data.isEditableGrid;
    //   this.showloading = false;
    //   this.defaultSelectedValue = false
    //   this.MiListProperties.fieldType = {
    //     'SelectData': new MiListFieldType('', 'SelectData', '', '', 'radio-button', '', '', false, null, '', '', ''),
    //   }
    // }
    // refreshList() {
    //   this.dataTopost = this.data.postData;
    //   this.MiListProperties.requestPostData = this.dataTopost;
    //   this.MiListProperties.refreshHandler.next(true);
    // }
    // SecondListData() {
    //   this.listingURL = this.data.secondGridData.url
    //   this.SecondListProperties.url = this.listingURL;
    //   this.SecondListProperties.cachedList = this.data.secondGridData.cachedList;
    //   this.SecondListProperties.requestPostData = this.data.postData;
    //   this.SecondListProperties.miDataSource = new TableDataSource(this.CommanDataSvc);
    //   this.SecondListProperties.displayedColumns = this.data.secondGridData.displayedColumns;
    //   this.SecondListProperties.columnLabels = this.data.secondGridData.columnLabels;
    //   this.SecondListProperties.columnIsSortable = this.data.secondGridData.columnIsSortable;
    //   this.SecondListProperties.refreshHandler = this.needRefreshSecondList;
    //   this.SecondListProperties.miListMenu = new MiListMenu();
    //   this.SecondListProperties.miListMenu.visibleOnDesk = true;
    //   this.SecondListProperties.miListMenu.visibleOnMob = false;
    //   this.SecondListProperties.isEditablegrid = false;
    //   this.SecondListProperties.accordingPanelHeader = ['Insur'];
    //   this.SecondListProperties.isaccordingPanelShown = true;
    //   this.showloading = false;
    //   this.defaultSelectedValue = false
    //   this.SecondListProperties.fieldType = {
    //     'SelectData': new MiListFieldType('', 'SelectData', '', '', 'radio-button', '', '', false, null, '', '', ''),
    //   }
    //   this.SecondListProperties.miListMenu.menuItems =
    //     [
    //       new MiListMenuItem('View Data', 3, true, false, null, 'img-icons arrow-down-icn'),
    //     ];
    // }
    // RefreshSecondListData() {
    //   this.dataTopost = this.data.postData;
    //   this.SecondListProperties.requestPostData = this.dataTopost;
    //   this.SecondListProperties.refreshHandler.next(true);
    // }
    // MenuItemClicked(data) {
    //   if (data.name === 'View Data') {
    //     data.data.show = !data.data.show;
    //     if (data.data.show === true) {
    //       data.event.class = 'img-icons arrow-down-icn'
    //     } else {
    //       data.event.class = 'img-icons arrow-up-icn'
    //     }
    //     this.isaccordionPanelShow = true;

    //     this.GetAccordionPanelList();
    //     this.GetAccordionPanelParameterList(data);
    //   }
    // }
    // GetAccordionPanelList() {
    //   const url = '/api/CompManager/getLinkedPolicyPayments';
    //   this.accordionPanelList.url = url;
    //   this.accordionPanelList.miDataSource = new TableDataSource(this.CommanDataSvc);
    //   this.accordionPanelList.columnLabels = ['Checkbox',
    //     'Invoice date', 'Amount', 'Incoming %', 'Units', 'Fee', 'Share per', 'Total payment'];
    //   this.accordionPanelList.displayedColumns = ['Checkbox', 'InvoiceDateString', 'PaymentRecived',
    //     'CommissionPercentage', 'NumberOfUnits', 'Fee', 'SplitPer', 'TotalPayment'];
    //   this.accordionPanelList.columnIsSortable = ['false', 'false', 'true', 'false', 'true', 'false', 'true', 'false'];
    //   this.accordionPanelList.miListMenu = new MiListMenu();
    //   this.accordionPanelList.miListMenu.visibleOnDesk = true;
    //   this.accordionPanelList.miListMenu.visibleOnMob = false;
    //   this.accordionPanelList.isFooterRequired = false;
    //   this.accordionPanelList.isClientSideList = false;
    //   this.accordionPanelList.refreshHandler = this.accordionPanelNeedRefresh;
    //   this.accordionPanelList.resetPagingHandler = this.needPageReset;
    //   this.accordionPanelList.isClientSideList = true;
    //   this.accordionPanelList.isRowClickable = false;
    //   this.accordionPanelList.showPaging = false;
    //   this.accordionPanelList.isEditablegrid = true;
    //   this.accordionPanelList.fieldType = {
    //     'Checkbox': new MiListFieldType('', 'Checkbox', '', '', 'check-box', '', '', false, null, '', '', ''),
    //   }
    // }
    // GetAccordionPanelParameterList(value) {
    //   this.postdata = {
    //     'policyId': value.data.PolicyId
    //   };
    //   this.accordionPanelList.requestPostData = this.postdata;
    //   this.accordionPanelList.refreshHandler.next(true);
    // }
 // }