import { Component, OnInit } from '@angular/core';
import { ConfigManagerService } from '../config-manager.service';
import { ConfigAPIUrlService } from '../configAPIURLService';
import { CommonDataService } from '../../_services/common-data.service';
import { ResponseCode } from '../../response.code';
import { FormControl } from '@angular/forms';
import { GetRouteParamtersService } from '../../_services/getRouteParamters.service';
import { MiProperties } from '../../shared/mi-list/mi-properties';
import { AppLevelDataService } from '../../_services/app-level-data.service';
import { TableDataSource } from '../../_services/table.datasource';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { MiListMenu } from '../../shared/mi-list/mi-list-menu';
import { MiListMenuItem } from '../../shared/mi-list/mi-list-menu-item';
import { Guid } from 'guid-typescript';
import { MatDialog } from '@angular/Material/dialog';
import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {
  title: any;
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  postData: any;
  searchData: any;
  showLoader: any;
  UserDetails: any;
  constructor(

    public configService: ConfigManagerService,
    public configAPIURLService: ConfigAPIUrlService,
    public commonsvc: CommonDataService,
    public getrouteParamters: GetRouteParamtersService,
    public route: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.title = 'Configuration Manager';
    this.UserDetails = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetProductListing();
    this.ProductListPrmtrs();
  }
  GetProductListing() {
    this.MiListProperties.url = this.configAPIURLService.productAPIRoute.GetProductListing;
    this.MiListProperties.miDataSource = new TableDataSource(this.configService);
    this.MiListProperties.displayedColumns = ['Name', 'Action'];
    this.MiListProperties.columnLabels = ['Product Name', ''];
    this.MiListProperties.columnIsSortable = ['true', 'false']
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.initialSortBy = 'Name'
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn')
      ]

  }
  ProductListPrmtrs() {
    this.postData = {
      'licenseeId': this.UserDetails['UserCredentialID'],
      'FilterBy': this.searchData
    }
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
  }
  doSearch() {
    //this.showLoading = false;
    this.MiListProperties.resetPagingHandler.next(true);
    this.ProductListPrmtrs()
  }
  openDeleteDialogBox(deletedRecordData) {
    this.postData = {
      'coverageId': deletedRecordData.CoverageID,
      'flag': true
    };
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Product ',
        subTitle: 'Are you sure you want to delete this product?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showLoader = true;
        this.configService.DeleteProducts(this.postData).subscribe(getresponse => {
          if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
            this.showLoader = false;
            this.MiListProperties.refreshHandler.next(true);

          }
        });
      }
    })
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
  OnMenuClicked(selectedrecord) {
    
    if (selectedrecord.name === 'Edit') {
      this.OnAddUpdateProduct('edit', selectedrecord);
    }
    else if (selectedrecord.name === 'Delete') {
      this.showLoader = true;
      this.postData = {
        'coverageId': selectedrecord.data.CoverageID,
        'flag': false
      };
      this.configService.DeleteProducts(this.postData).subscribe(getresponse => {
        if (getresponse.ResponseCode === ResponseCode.SUCCESS && getresponse.RecordStatus == false) {
          this.openDeleteDialogBox(selectedrecord.data);
        }
        else {
          this.OnProductAssociatedWithPolicies();
        }
        this.showLoader = false;
      });
    }
  }
  OnProductAssociatedWithPolicies() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Delete Product',
        subTitle: 'Product cannot be deleted as there are policies associated with Product in the system.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
  }
  OnAddUpdateProduct(value, selectedRecord) {
    
    const title = value == 'create' ? 'Create Product ' : 'Edit Product ';
    const buttonText = value == 'create' ? 'Create' : 'Update';
    const dilogRef = this.dialog.open(AddEditProductComponent, {
      data: {
        ProductId: value == 'create' ? null : selectedRecord.data.CoverageID,
        Name: value == 'create' ? null : selectedRecord.data.Name,
        headingTitle: title,
        subTitle: '',
        primaryButton: buttonText,
        secondryButton: 'Cancel',
        extraData: {
          'iscreate': value == 'create' ? 'true' : 'False'
        }
      },
      width: '500px',
      disableClose:true
    });
    dilogRef.afterClosed().subscribe(result => {
      if (result) {
        this.MiListProperties.refreshHandler.next(true);
      }
    });
  }
}
