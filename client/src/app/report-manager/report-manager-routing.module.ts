import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayeeReportListingComponent } from './payee-report-listing/payee-report-listing.component';
import { AuditReportListingComponent } from './audit-report-listing/audit-report-listing.component';
import { ManagementReportListingComponent } from './management-report-listing/management-report-listing.component';
const routes: Routes = [
  {
    path: '',
    component: PayeeReportListingComponent,
    redirectTo: 'payee-reports/1'
  },
  {
    path: 'payee-reports/:ParentTab',
    component: PayeeReportListingComponent,
  },
  {
    path: 'audit-reports/:ParentTab',
    component: AuditReportListingComponent,
  },
  {
    path: 'management-reports/:ParentTab',
    component: ManagementReportListingComponent,
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportManagerRoutingModule { }
