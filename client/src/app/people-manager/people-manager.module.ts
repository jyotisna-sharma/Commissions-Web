import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowConfirmationComponent } from '../_services/dialogboxes/show-confirmation/show-confirmation.component';
import { PeopleManagerRoutingModule } from './people-manager-routing.module';
import { PeopleManagerListingComponent } from './people-manager-listing/people-manager-listing.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { PeopleManagerValidationMessageService } from './people-manager-validation-message.service';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
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
import { AddEditAgentComponent } from './add-edit-agent/add-edit-agent.component';
import { PeopleManagerPermissionsComponent } from './people-manager-permissions/people-manager-permissions.component';
import { SharedModule } from '../shared/shared.module';
import { PeopleManagerAPIUrlService } from './people-manager-url.service';
import { UserMappingComponent } from './user-mapping/user-mapping.component'
// import { NumberDirective } from '../directives/numbers-only.directive';
import { AutofocusModule } from 'angular-autofocus-fix';
import { PeopleManagerLeftNavigationComponent } from './people-manager-left-navigation/people-manager-left-navigation.component';
import { RouterModule } from '@angular/router';
import { ResponseErrorService } from '../_services/response-error.service';
import { PeopleManagerUserListingComponent } from './people-manager-user-listing/people-manager-user-listing.component';
import { DataEntryUserListingComponent } from './data-entry-user-listing/data-entry-user-listing.component';
import { AddEditDataEntryUsersComponent } from '../people-manager/add-edit-data-entry-users/add-edit-data-entry-users.component'
@NgModule({
  imports: [
    CommonModule,
    PeopleManagerRoutingModule,
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
    GooglePlaceModule,
    AutofocusModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [PeopleManagerListingComponent, AddEditAgentComponent, PeopleManagerPermissionsComponent,
    UserMappingComponent, PeopleManagerLeftNavigationComponent,
    PeopleManagerUserListingComponent, DataEntryUserListingComponent,AddEditDataEntryUsersComponent],
  entryComponents: [],
  providers: [PeopleManagerValidationMessageService, PeopleManagerAPIUrlService, ResponseErrorService]
})
export class PeopleManagerModule { }
