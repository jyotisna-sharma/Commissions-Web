import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportSettingListingComponent } from '../settings/report-setting-listing/report-setting-listing.component';
import { CreateSettingScheduleComponent } from '../settings/create-setting-schedule/create-setting-schedule.component';
import { CommissionScheduleListingComponent } from '../settings/commission-schedule-listing/commission-schedule-listing.component';
import { AuthGuard } from '../_guards';
import { NamedScheduleListingComponent } from './named-schedule-listing/named-schedule-listing.component';
import { SegmentListingComponent } from './segment-listing/segment-listing.component';
const routes: Routes = [
  {
    path: '',
    component: CommissionScheduleListingComponent,
    redirectTo: 'commissionScheduleListing/1/1/10/0'
  },
  {
    path: 'commissionScheduleListing/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: CommissionScheduleListingComponent
  },
  {
    path: 'NamedScheduleListing/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: NamedScheduleListingComponent
  },
  {
    path: 'SegmentListing/:ParentTab/:pageSize/:pageIndex',
    component: SegmentListingComponent,

  },
  {
    path: 'Reportsetting/:ParentTab/:pageSize/:pageIndex',
    component: ReportSettingListingComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'createSchedule/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: CreateSettingScheduleComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'EditSchedule/:ParentTab/:childTab/:pageSize/:pageIndex/:IncomingScheduleId',
    component: CreateSettingScheduleComponent,
    canDeactivate: [AuthGuard],
  }


]
@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {



}
