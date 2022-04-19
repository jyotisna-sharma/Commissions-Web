import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayorListingComponent } from './payor-listing/payor-listing.component';
import { ConfigManagerLeftNavigationComponent } from './config-manager-left-navigation/config-manager-left-navigation.component';
import { ConfigManagerRoutingModule } from './config-manager-routing.module';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { SharedModule } from '../shared/shared.module';
import { CarrierListingComponent } from './carrier-listing/carrier-listing.component';
import { AddEditCarrierComponent } from './add-edit-carrier/add-edit-carrier.component';
import { EditPayorComponent } from './edit-payor/edit-payor.component';
import { PayorContactsComponent } from './payor-contacts/payor-contacts.component';
import { EditPayorContactComponent } from './edit-payor-contact/edit-payor-contact.component';
import { ProductTypeListComponent } from './product-type-listing/product-type-listing.component';
import { AddEditProductTypeComponent } from './add-edit-product-type/add-edit-product-type.component';
import { FollowUpSettingComponent } from './follow-up-setting/follow-up-setting.component';
import { CompTypeListingComponent } from './comp-type-listing/comp-type-listing.component';
import { AddEditCompTypeComponent } from './add-edit-comp-type/add-edit-comp-type.component';
import { AutofocusModule } from 'angular-autofocus-fix';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
@NgModule({
  imports: [
    CommonModule,
    ConfigManagerRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    AutofocusModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    RouterModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2TelInputModule,
    SharedModule,
    MatAutocompleteModule
  ],
  declarations: [PayorListingComponent, ConfigManagerLeftNavigationComponent, ProductListingComponent,AddEditProductComponent,
    CarrierListingComponent, AddEditCarrierComponent, PayorContactsComponent, AddEditProductTypeComponent, AddEditCompTypeComponent,
    EditPayorComponent, EditPayorContactComponent, ProductTypeListComponent, FollowUpSettingComponent, CompTypeListingComponent],
  entryComponents: [AddEditCarrierComponent, EditPayorComponent, AddEditProductTypeComponent, AddEditCompTypeComponent,AddEditProductComponent]
})
export class ConfigurationModule { }
