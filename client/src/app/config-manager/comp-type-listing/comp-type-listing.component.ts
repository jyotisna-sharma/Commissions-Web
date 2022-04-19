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
import { AddEditCompTypeComponent } from '../add-edit-comp-type/add-edit-comp-type.component';
import { ResponseCode } from '../../response.code';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { stringify } from '@angular/compiler/src/util';
@Component({
  selector: 'app-comp-type-listing',
  templateUrl: './comp-type-listing.component.html',
  styleUrls: ['./comp-type-listing.component.scss']
})
export class CompTypeListingComponent implements OnInit {
  title: any;
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  postdata: any;
  showloading: boolean = false;
  searchData: any;
  CompTypesList: any;
  isCompTypeListFound: boolean = false;;
  Comptype = new FormControl('', []);
  columnLabels: string[] = [
    'Comp type',
    'Name',
    ''
  ]

  displayedColumns: string[] = [
    'PaymentTypeName',
    'Names',
    'Action'
  ];

  columnIsSortable: string[] = [
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
    this.title = 'Comp type';
    this.showloading = true;
    this.GetCompTypeList();
  }
  GetCompTypeListing() {
    this.MiListProperties.url = this.configAPIURLService.CompTypeAPIRoute.GetCoverageTypeListing;
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
    this.MiListProperties.initialSortBy = 'PaymentTypeName'
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn')


      ]
  }
  GetCompTypeListPrmtrs() {
    let paymentTypeName = null;
    this.CompTypesList.map(element => {
      if (element.PaymentTypeId == this.Comptype.value) {
        paymentTypeName = element.PaymenProcedureName;
      }
    });
    this.postdata = {
      'incomingPaymentTypeId': this.Comptype.value,
      'paymentTypeName': paymentTypeName
    }
    this.MiListProperties.requestPostData = this.postdata;
    this.MiListProperties.refreshHandler.next(true);
  }
  OnChangeCompType() {
    this.GetCompTypeListPrmtrs();
  }
  OnMenuItemClick(selectedRecord) {
    if (selectedRecord.name === 'Edit') {
      this.OnAddUpdateCompType('Edit', selectedRecord);
    }
    else if (selectedRecord.name === 'Delete') {
      this.openDeleteDialogBox(selectedRecord);
    }
  }
  GetCompTypeList() {
    this.postdata = {};
    this.commonsvc.getIncomingPaymentTypes(this.postdata).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showloading = false;
        this.isCompTypeListFound = true;
        this.CompTypesList = response.PolicyIncomingPaymentList;
        this.CompTypesList.unshift({
          'PaymenProcedureName': 'All',
          'PaymentTypeId': 6
        });

        this.Comptype.setValue(this.CompTypesList[0].PaymentTypeId);
        this.GetCompTypeListing();
        this.GetCompTypeListPrmtrs();
      }
    })
  }
  OnAddUpdateCompType(pageTitle, selectedRecord) {
    let CompTypesListing=JSON.parse(JSON.stringify( this.CompTypesList))
    CompTypesListing.splice(0, 1);
    const title = pageTitle == 'create' ? 'Create Comp Type ' : 'Edit Comp Type ';
    const buttonText = pageTitle == 'create' ? 'Create' : 'Update';
    let paymentTypeName = null;
    const dilogRef = this.dialog.open(AddEditCompTypeComponent, {
      data: {
        comptypeList: CompTypesListing,
        selectedCompTypeId: pageTitle == 'create' ? this.Comptype.value : selectedRecord.data.IncomingPaymentTypeID,
        Id: pageTitle == 'create' ? -1 : selectedRecord.data.Id,
        headingTitle: title,
        subTitle: '',
        primaryButton: buttonText,
        secondryButton: 'Cancel',
        Name: pageTitle == 'create' ? null : selectedRecord.data.Names
      },
      width: '450px',
      disableClose:true
    });
    dilogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MiListProperties.refreshHandler.next(true);
      }
    })
  }
  openDeleteDialogBox(deletedRecordData) {
    this.postdata = {
      'objCompType': {
        'Id': deletedRecordData.data.Id,
      }
    };
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Comp Type',
        subTitle: 'Are you sure you want to delete this comp type?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showloading = true;
        this.configService.DeleteCompType(this.postdata).subscribe(getresponse => {
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
}
