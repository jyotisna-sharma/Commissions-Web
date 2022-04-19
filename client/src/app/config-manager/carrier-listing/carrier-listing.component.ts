import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { TableDataSource } from '../../_services/table.datasource';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from '../../response.code';
import { AddEditCarrierComponent } from '../add-edit-carrier/add-edit-carrier.component';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';

@Component({
  selector: 'app-carrier-listing',
  templateUrl: './carrier-listing.component.html',
  styleUrls: ['./carrier-listing.component.scss']
})
export class CarrierListingComponent implements OnInit {
  title: any;
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  url: any;
  postdata: any;
  searchData: any;
  filterData = false;
  userdetail: any;
  isEditScreen: Boolean = false;
  ispayorlistfound: Boolean = false;
  filterParameter: any;
  showloading: Boolean = true;
  payorList: any;
  getCarrierDetails: any;
  carrierCount: any = 0;
  payor = new FormControl('', {});
  columnLabels: string[] = [
    'Carrier Name',
    'Nickname',
    'Track missing month',
    'Track Incoming %',
    ''
  ]

  displayedColumns: string[] = [
    'CarrierName',
    'NickName',
    'TrackMissingMonth',
    'TrackIncomingPercentage',
    'Action'
  ];

  columnIsSortable: string[] = [
    'true',
    'true',
    'true',
    'true',
    'false'
  ];
  constructor(
    public dialog: MatDialog,
    private appData: AppLevelDataService,
    private activateroute: ActivatedRoute,
    private router: Router,
    public getrouteParamters: GetRouteParamtersService,
    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public commonsvc: CommonDataService
  ) { }

  ngOnInit() {
    this.title = 'Configuration Manager';
    this.getrouteParamters.getparameterslist(this.activateroute);
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayorList();
  }
  //------------------------------------Methods used for Get carrier listing-------------------------------------------------------
  GetCarrierListing() {
    this.url = this.configAPIURLService.ConfigAPIRoute.GetCarrierListing;
    this.MiListProperties.url = this.url
    this.MiListProperties.miDataSource = new TableDataSource(this.configService);
    this.MiListProperties.displayedColumns = this.displayedColumns;
    this.MiListProperties.columnLabels = this.columnLabels;
    this.MiListProperties.columnIsSortable = this.columnIsSortable;
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.initialSortBy = 'CarrierName'
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Product Type', 3, true, false, null, 'img-icons product-icn'),
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn')


      ]
    this.MiListProperties.miDataSource.dataSubject.subscribe(isloadingDone => {
      if (isloadingDone && isloadingDone.length > 0) {
        this.carrierCount = this.MiListProperties.miDataSource.tableData.length;
      }
    });
  }
  CarrierListPrmtrs() {
    this.postdata = {
      'payorId': this.payor.value,
      'FilterBy': this.searchData
    }
    this.MiListProperties.requestPostData = this.postdata;
    this.MiListProperties.refreshHandler.next(true);
  }
  // *****************************************************************************************************************************
  // --------------------------Method used for getting list of payors for showing in dropdown--------------------------------------------------------
  GetPayorList() {
    this.commonsvc.getPayorsList({ 'LicenseeID': this.userdetail && this.userdetail['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        //  this.showLoader = false;
        this.showloading = false;
        this.ispayorlistfound = true;
        this.payorList = response.PayorList;
        if (this.getrouteParamters.payorId) {
          this.payor.setValue(this.getrouteParamters.payorId);
        } else {
          this.payor.setValue(this.payorList[0].PayorID);
        }
        this.GetCarrierListing();
        this.CarrierListPrmtrs();
      }
    });
  }
  // *******************************************************************************************************************************
  // -------------------------method used for refresh a list based on  changed payor selection------------------------------------------------------------------------
  OnChangePayor(data) {
    this.payor.setValue(data.value);
    this.CarrierListPrmtrs();
  }
  // *******************************************************************************************************************************
  // ------------------------------------Method used for taking action on record action button clicks-------------------------------------------------------------
  OnMenuItemClick(clickedRecord) {
    if (clickedRecord.name === 'Edit') {
      this.postdata = {
        'carrierId': clickedRecord.data.CarrierId
      }
      this.getCarrierDetails = clickedRecord.data;
      this.isEditScreen = true;
      this.OnAddUpdateCarrierDialog();
    } else if (clickedRecord.name === 'Delete') {
      this.showloading = true;
      this.postdata = {
        'carrierId': clickedRecord.data.CarrierId,
        'payorId': clickedRecord.data.PayorId,
        'deleteFlag': false
      };
      this.configService.DeleteCarrier(this.postdata).subscribe(response => {
        this.showloading = false;
        if (response.ResponseCode === ResponseCode.SUCCESS) {
          if (response.RecordStatus) {
            this.openDeleteDialogBox(this.postdata);
          }
          else {
            this.OnCarrierHasPoliciesDialogBox();
          }
        }

      });
    }
    else if (clickedRecord.name === 'Product Type') {
      this.router.navigate(['config-manager/product-type-listing', clickedRecord.data.PayorId,
        clickedRecord.data.CarrierId, 4,
        this.getrouteParamters.pageSize, this.getrouteParamters.pageIndex])
    }
  }
  // *******************************************************************************************************************************
  // ------------------------------------------Methods used for add/update the details of carrier------------------------------------------------------
  OnAddUpdateCarrier() {
    this.isEditScreen = false;
    this.OnAddUpdateCarrierDialog();
  }
  OnAddUpdateCarrierDialog() {
    const dilogref = this.dialog.open(AddEditCarrierComponent, {
      data: {
        payorList: this.payorList,
        selectedPayor: this.payor.value,
        selectedCarrierData: this.getCarrierDetails,
        isEditScreen: this.isEditScreen
      },
      disableClose: true
    });
    dilogref.afterClosed().subscribe(result => {
      if (result) {
        this.payor.setValue(result);
        this.searchData = '';
        this.CarrierListPrmtrs();
      }
    });
  }
  // *******************************************************************************************************************************
  // -------------------------------------Methods used for delete a carrier ------------------------------------------------------------
  openDeleteDialogBox(deletedRecordData) {
    this.postdata = {
      'carrierId': deletedRecordData.carrierId,
      'payorId': deletedRecordData.payorId,
      'deleteFlag': true
    };
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Carrier',
        subTitle: 'Are you sure you want to delete this carrier?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = true;
        this.configService.DeleteCarrier(this.postdata).subscribe(getresponse => {
          if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
            this.showloading = false;
            this.MiListProperties.refreshHandler.next(true);
            //this.showLoading = false;
          } else {
            // this.error.OpenResponseErrorDilog(getresponse.Message);
            // this.showLoading = false;
          }
        });
      }
    })
  }
  OnCarrierHasPoliciesDialogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Delete Carrier',
        subTitle: 'Carrier cannot be deleted as policies are associated with carrier in the system.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
  }
  // *******************************************************************************************************************************
  // ------------------------------------Method used for search baes n searching value------------------------------------------------------------
  doSearch() {
    //this.showLoading = false;
    this.MiListProperties.resetPagingHandler.next(true);
    this.CarrierListPrmtrs()
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
  // *******************************************************************************************************************************
}
