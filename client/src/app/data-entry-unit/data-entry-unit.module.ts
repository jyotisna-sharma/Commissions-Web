import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData, CurrencyPipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PostDataEntryComponent } from './post-data-entry/post-data-entry.component';
import { DataEntryUnitRoutingModule } from './data-entry-unit-routing.module';
import { BatchStatementListComponent } from './batch-statement-list/batch-statement-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { AutofocusModule } from 'angular-autofocus-fix';
import { PostEntrySectionComponent } from './post-data-entry/post-entry-section/post-entry-section.component';
import { PostEntryBottomSectionComponent } from './post-data-entry/post-entry-bottom-section/post-entry-bottom-section.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AdminHeaderComponent } from '../layouts/admin-header/admin-header.component';
import{DataEntryUnitService} from './data-entry-unit.service';


@NgModule({
  declarations: [BatchStatementListComponent, PostEntrySectionComponent,
    PostEntryBottomSectionComponent, PostDataEntryComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataEntryUnitRoutingModule,
    CommonModule,
    AutofocusModule,
    MatPaginatorModule,
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
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
    FormsModule,
    ReactiveFormsModule, // required animations module
    ToastrModule,
    NgxMaskModule
  ],
  providers: [DatePipe, CurrencyPipe,DataEntryUnitService],
})
export class DataEntryUnitModule { }
