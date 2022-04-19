import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PolicyManagerRoutingModule } from './policy-manager-routing.module';
import { PolicyManagerListingComponent } from './policy-manager-listing/policy-manager-listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { CreateNewPolicyComponent } from './create-new-policy/create-new-policy.component';
import { PolicyHeaderComponent } from './policy-header/policy-header.component';
import { PolicyManagerLeftNavigationComponent } from './policy-manager-left-navigation/policy-manager-left-navigation.component';
import { PolicyNoteComponent } from './policy-note/policy-note.component';
import { PolicymanagerService } from '../policy-manager/policymanager.service';
import { PolicySmartFieldsComponent } from './policy-smart-fields/policy-smart-fields.component';
import { CommDashboardComponent } from './comm-dashboard/comm-dashboard.component';
import { PolicyIssuesComponent } from './policy-issues/policy-issues.component';
import { AutofocusModule } from 'angular-autofocus-fix';
import { ImportPolicyComponent } from './import-policy/import-policy.component';
import { ImportPolicyGridComponent } from './import-policy-grid/import-policy-grid.component';
import { PolicyAdvanceSearchComponent } from './policy-advance-search/policy-advance-search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UploadNotesFileComponent } from './policy-note/upload-notes-file/upload-notes-file.component';
import { ClientInfoComponent } from '../_services/dialogboxes/client-info/client-info.component';

@NgModule({
  imports: [
    CommonModule,
    PolicyManagerRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    AutofocusModule,
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
    MatAutocompleteModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    SharedModule
  ],
  declarations: [PolicyManagerListingComponent, CreateNewPolicyComponent, UploadNotesFileComponent,ClientInfoComponent,
    PolicyHeaderComponent, PolicyManagerLeftNavigationComponent,
    PolicyNoteComponent, PolicySmartFieldsComponent, CommDashboardComponent,
    PolicyIssuesComponent, ImportPolicyComponent, ImportPolicyGridComponent, PolicyAdvanceSearchComponent, UploadNotesFileComponent],
  providers: [PolicymanagerService],
  entryComponents: [UploadNotesFileComponent,ClientInfoComponent]
})
export class PolicyManagerModule {
}
