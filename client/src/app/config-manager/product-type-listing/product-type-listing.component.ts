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
import { AddEditProductTypeComponent } from '../add-edit-product-type/add-edit-product-type.component';
import { SuccessMessageComponent } from '../../_services/dialogboxes/success-message/success-message.component';
import { RemoveConfirmationComponent } from '../../_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-product-type-list',
  templateUrl: './product-type-listing.component.html',
  styleUrls: ['./product-type-listing.component.scss']
})
export class ProductTypeListComponent implements OnInit {
  MiListProperties: MiProperties = new MiProperties();
  needRefresh: Subject<boolean> = new Subject();
  needPageReset: Subject<boolean> = new Subject();
  userdetail: any;
  Payor = new FormControl('', {});
  payorList: any;
  postData: any;
  showLoader: any;
  isButtondisabled: boolean = false;
  title: any;
  Carrier = new FormControl('', {});
  carrierList: any;
  Product = new FormControl('', {});
  productsList: any;
  isallValueSet: Boolean = false;
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
    this.userdetail = JSON.parse(localStorage.getItem('loggedUser'));
    this.GetPayorList();
    this.GetProductList();
  }
  GetPayorList() {
    this.showLoader = true;
    this.commonsvc.getPayorsList({ 'LicenseeID': this.userdetail && this.userdetail['LicenseeId'] }).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.showLoader = false;
        this.payorList = response.PayorList;
        if (this.getrouteParamters.payorId) {
          this.Payor.setValue(this.getrouteParamters.payorId);
        } else {
          this.Payor.setValue(this.payorList[0].PayorID);
        }
        this.showLoader = false;
        this.getrouteParamters.carrierId = '';
        this.GetCarrierList();

      }
    });
  }
  GetCarrierList() {
    this.showLoader = true;
    this.postData = {
      'payorId': this.Payor.value
    }
    this.commonsvc.getCarrierList(this.postData).subscribe(response => {
      this.showLoader = false;

      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.carrierList = response.CarrierList;
        this.isallValueSet = true;
        if (this.getrouteParamters.carrierId) {
          this.Carrier.setValue(this.getrouteParamters.carrierId);
        } else {
          if (this.carrierList.length > 0) {
            this.Carrier.setValue(this.carrierList[0].CarrierId);
          }
        }

        if (this.carrierList.length === 0) {
          this.isButtondisabled = true;
          this.Carrier.disable();
        } else {
          this.Carrier.enable();
          this.isButtondisabled = false;
        }
        this.GetProductListingListing();
        this.ProductListPrmtrs();

      }

    });
  }
  GetProductList() {
   
    this.postData = {
      'LicenseeID': this.userdetail && this.userdetail['LicenseeId']
    }
    this.commonsvc.getProductsList(this.postData).subscribe(response => {
      if (response.ResponseCode === ResponseCode.SUCCESS) {
        this.productsList = response.DisplayCoverageList;
       
        this.productsList.unshift({
          'CoverageID': Guid.createEmpty().toJSON().value,
          'IsGlobal': true,
          'Name': "All"
        }
        );
        this.Product.setValue(this.productsList[0].CoverageID);
      }
    });

  }
  GetProductListingListing() {
    this.MiListProperties.url = this.configAPIURLService.ConfigAPIRoute.GetProductListing;
    this.MiListProperties.miDataSource = new TableDataSource(this.configService);
    this.MiListProperties.displayedColumns = ['ProductName', 'NickName', 'Action'];
    this.MiListProperties.columnLabels = ['Product', 'Product Type', ''];
    this.MiListProperties.columnIsSortable = ['true', 'true', 'false']
    this.MiListProperties.refreshHandler = this.needRefresh;
    this.MiListProperties.miListMenu = new MiListMenu();
    this.MiListProperties.miListMenu.visibleOnDesk = true;
    this.MiListProperties.miListMenu.visibleOnMob = false;
    this.MiListProperties.showPaging = true;
    this.MiListProperties.pageSize = this.getrouteParamters.pageSize
    this.MiListProperties.initialPageIndex = this.getrouteParamters.pageIndex
    this.MiListProperties.resetPagingHandler = this.needPageReset;
    this.MiListProperties.initialSortBy = 'ProductName'
    this.MiListProperties.initialSortOrder = 'asc'
    this.MiListProperties.miListMenu.menuItems =
      [
        new MiListMenuItem('Edit', 0, true, false, null, 'img-icons edit-icn'),
        new MiListMenuItem('Delete', 3, true, false, null, 'img-icons delete-icn')
      ]

  }
  ProductListPrmtrs() {
    this.postData = {
      'payorId': this.Payor.value,
      'carrierId': this.Carrier.value,
      'coverageId': this.Product.value,
    }
    this.MiListProperties.requestPostData = this.postData;
    this.MiListProperties.refreshHandler.next(true);
  }
  OnChangingFilter(value) {
    if (value == 'carrier') {
      this.Product.setValue(this.productsList[0].CoverageID);
    }
    this.MiListProperties.resetPagingHandler.next(true);
    this.ProductListPrmtrs();
  }
  OnMenuItemClick(selectedrecord) {
    if (selectedrecord.name === 'Edit') {
      this.OnAddUpdateProduct('edit', selectedrecord);
    }
    else if (selectedrecord.name === 'Delete') {
      this.showLoader = true;
      this.postData = {
        'coverageNickId': selectedrecord.data.CoverageNickId,
        'coverageNickName': selectedrecord.data.NickName,
        'deleteFlag': false
      };
      this.configService.DeleteProductType(this.postData).subscribe(getresponse => {
        this.showLoader = false;

        if (getresponse.ResponseCode === ResponseCode.SUCCESS && getresponse.RecordStatus == true) {
          this.OnCoverageHasPoliciesDialogBox();
        }
        else {
          this.openDeleteDialogBox(selectedrecord);
        }

      });
      // this.openDeleteDialogBox(selectedrecord.data);
    }
  }
  OnAddUpdateProduct(value, selectedRecord) {
   
    let productListing = JSON.parse(JSON.stringify(this.productsList));
   
    productListing.splice(0, 1);

    const title = value == 'create' ? 'Create Product Type ' : 'Edit Product Type ';
    const buttonText = value == 'create' ? 'Create' : 'Update';
    const dilogRef = this.dialog.open(AddEditProductTypeComponent, {
      data: {
        payorId: value == 'create' ? this.Payor.value : selectedRecord.data.PayorID,
        carrierId: value == 'create' ? this.Carrier.value : selectedRecord.data.CarrierID,
        productId: value == 'create' ? this.Product.value : selectedRecord.data.CoverageID,
        NickName: value == 'create' ? null : selectedRecord.data.NickName,
        CoverageNickId: value == 'create' ? null : selectedRecord.data.CoverageNickId,
        headingTitle: title,
        subTitle: '',
        primaryButton: buttonText,
        secondryButton: 'Cancel',
        extraData: {
          'ProductList': productListing,
          'CarrierList': this.carrierList,
          'PayorList': this.payorList,
          'iscreate': value == 'create' ? 'true' : 'False'
        }
      },
      disableClose: true
    });
    dilogRef.afterClosed().subscribe(result => {
     
      if (result) {
        this.productsList = [];
        this.MiListProperties.refreshHandler.next(true);
        this.GetProductList();
      }
      else {
        // this.GetProductList();
      }
    });
  }
  openDeleteDialogBox(deletedRecordData) {
    this.postData = {
      'coverageNickId': deletedRecordData.data.CoverageNickId,
      'coverageNickName': deletedRecordData.data.NickName,
      'flag': true
    };
    const dialogRef = this.dialog.open(RemoveConfirmationComponent, {
      data: {
        headingTitle: 'Delete Product Type',
        subTitle: 'Are you sure you want to delete this product type?',
        primaryButton: 'Yes, Delete'
      },
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.showLoader = true;
        this.configService.DeleteProductType(this.postData).subscribe(getresponse => {
          if (getresponse.ResponseCode === ResponseCode.SUCCESS) {
            this.showLoader = false;
            this.MiListProperties.refreshHandler.next(true);
          }
        });
      }
    })
  }
  OnCoverageHasPoliciesDialogBox() {
    const dialogRef = this.dialog.open(SuccessMessageComponent, {
      data: {
        Title: 'Delete Product Type',
        subTitle: 'Product type cannot be deleted as policies are associated with product type in the system.',
        buttonName: 'ok',
        isCommanFunction: false
      },
      width: '400px',
      disableClose: true,
    });
  }
}

