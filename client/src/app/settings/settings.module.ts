import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SettingsRoutingModule } from '../settings/settings-routing.module';
// import { SettingListingComponent } from '../settings/setting-listing/setting-listing.component';
import { SettingLeftNavigationComponent } from './setting-left-navigation/setting-left-navigation.component';
import { CreateSettingScheduleComponent } from './create-setting-schedule/create-setting-schedule.component';
import { CommissionScheduleListingComponent } from './commission-schedule-listing/commission-schedule-listing.component';
import { ReportSettingListingComponent } from './report-setting-listing/report-setting-listing.component';
import { NamedScheduleListingComponent } from './named-schedule-listing/named-schedule-listing.component';
import { AutofocusModule } from 'angular-autofocus-fix';
import { SegmentListingComponent } from './segment-listing/segment-listing.component';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';
@NgModule({
  imports: [
    CommonModule,
    MatPaginatorModule,
    AutofocusModule,
    SettingsRoutingModule,
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
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    NamedScheduleListingComponent,
    SettingLeftNavigationComponent, CreateSettingScheduleComponent, CommissionScheduleListingComponent, ReportSettingListingComponent, SegmentListingComponent,EditSegmentComponent ],
    entryComponents: [EditSegmentComponent]
})
export class SettingsModule { }
