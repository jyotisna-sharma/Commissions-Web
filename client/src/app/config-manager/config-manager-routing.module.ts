import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { PayorListingComponent } from './payor-listing/payor-listing.component';
import { CarrierListingComponent } from './carrier-listing/carrier-listing.component';
import { PayorContactsComponent } from './payor-contacts/payor-contacts.component';
import { EditPayorComponent } from './edit-payor/edit-payor.component';
import { EditPayorContactComponent } from './edit-payor-contact/edit-payor-contact.component';
import { AuthGuard } from '../_guards';
import { ProductTypeListComponent } from './product-type-listing/product-type-listing.component';
import { FollowUpSettingComponent } from './follow-up-setting/follow-up-setting.component';
import { CompTypeListingComponent } from './comp-type-listing/comp-type-listing.component';
import { ProductListingComponent } from './product-listing/product-listing.component';



const routes: Routes = [
  {
    path: '',
    component: PayorListingComponent,
    redirectTo: 'payor-listing/1/10/0'
  },
  {
    path: 'payor-listing/:ParentTab/:pageSize/:pageIndex',
    component: PayorListingComponent
  },
  {
    path: 'carrier-listing/:ParentTab/:pageSize/:pageIndex',
    component: CarrierListingComponent
  },
  {
    path: 'carrier-listing/:payorId/:ParentTab/:pageSize/:pageIndex',
    component: CarrierListingComponent
  },
  {
    path: 'product-type-listing/:ParentTab/:pageSize/:pageIndex',
    component: ProductTypeListComponent
  },
  {
    path: 'product-type-listing/:payorId/:carrierId/:ParentTab/:pageSize/:pageIndex',
    component: ProductTypeListComponent
  },
  {
    path: 'product-listing/:ParentTab/:pageSize/:pageIndex',
    component: ProductListingComponent
  },
  {
    path: 'payor-contacts/:ParentTab/:pageSize/:pageIndex',
    component: PayorContactsComponent
  },
  {
    path: 'payor-contacts/:payorId/:ParentTab/:pageSize/:pageIndex',
    component: PayorContactsComponent,

  },
  {
    path: 'add-payor-contact/:payorId/:ParentTab/:pageSize/:pageIndex',
    component: EditPayorContactComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'edit-payor-contact/:payorId/:payorContactId/:ParentTab/:pageSize/:pageIndex',
    component: EditPayorContactComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'follow-up-setting/:ParentTab',
    component: FollowUpSettingComponent,
   
  },
  {
    path: 'comp-type-listing/:ParentTab/:pageSize/:pageIndex',
    component: CompTypeListingComponent,
   
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigManagerRoutingModule { }
