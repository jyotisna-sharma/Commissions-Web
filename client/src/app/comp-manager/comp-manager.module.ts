import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
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
import { CompManagerRoutingModule } from './comp-manager-routing.module';
import { CompManagerLeftNavigationComponent } from './comp-manager-left-navigation/comp-manager-left-navigation.component';
import { BatchManagerComponent } from './batch-manager/batch-manager.component';
import { LinkPaymentToPoliciesComponent } from './link-payment-to-policies/link-payment-to-policies.component';
import { LinkToExistingPolicyComponent } from './link-to-existing-policy/link-to-existing-policy.component';
import { ChangeStatementDateComponent } from './change-statement-date/change-statement-date.component';
import{CompManagerListComponent} from './comp-manager-list/comp-manager-list.component';
@NgModule({
  imports: [
    MatAutocompleteModule,
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CompManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  declarations: [CompManagerLeftNavigationComponent, BatchManagerComponent,CompManagerListComponent,
     LinkPaymentToPoliciesComponent, LinkToExistingPolicyComponent, ChangeStatementDateComponent],
  entryComponents: [ChangeStatementDateComponent]
})
export class CompManagerModule { }
