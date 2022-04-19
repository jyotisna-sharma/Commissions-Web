import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PolicyManagerListingComponent } from './policy-manager-listing/policy-manager-listing.component';
import { CreateNewPolicyComponent } from './create-new-policy/create-new-policy.component';
import { AuthGuard } from '../_guards/auth.guard'
import { PolicyNoteComponent } from './policy-note/policy-note.component';
import { PolicySmartFieldsComponent } from './policy-smart-fields/policy-smart-fields.component';
import { CommDashboardComponent } from './comm-dashboard/comm-dashboard.component';
import { PolicyIssuesComponent } from './policy-issues/policy-issues.component';
import { ImportPolicyComponent } from './import-policy/import-policy.component';
import { PolicyAdvanceSearchComponent } from './policy-advance-search/policy-advance-search.component';
const routes: Routes = [
  {
    path: '',
    component: PolicyManagerListingComponent,
    redirectTo: 'policyListing/3/10/0',
    canDeactivate: [AuthGuard]
  },

  {
    path: 'smartFields/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: PolicySmartFieldsComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'CreateNewPolicy/:ClientId/:ParentTab/:pageSize/:pageIndex',
    component: CreateNewPolicyComponent,
    canDeactivate: [AuthGuard],
  },

  {
    path: 'PolicyNotes/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: PolicyNoteComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'policyListing/:ClientId/:ParentTab/:pageSize/:pageIndex',
    component: PolicyManagerListingComponent,
  },
  {
    path: 'policyListing/:ParentTab/:pageSize/:pageIndex',
    component: PolicyManagerListingComponent,
  },
  {
    path: 'clientPolicies/:ClientId/:ParentTab/:pageSize/:pageIndex',
    component: PolicyManagerListingComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'editPolicy/:ParentTab/:pageSize/:pageIndex/:PolicyId/:ClientId',
    component: CreateNewPolicyComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'editPolicy/:ParentTab/:pageSize/:pageIndex/:PolicyId/:IsDuplicate/:ClientId',
    component: CreateNewPolicyComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'advance-Search/editPolicy/:ParentTab/:pageSize/:pageIndex/:PolicyId/:ClientId',
    component: CreateNewPolicyComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'advance-Search/editPolicy/:ParentTab/:pageSize/:pageIndex/:PolicyId/:IsDuplicate/:ClientId',
    component: CreateNewPolicyComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'advance-Search/CreateNewPolicy/:ClientId/:ParentTab/:pageSize/:pageIndex',
    component: CreateNewPolicyComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'comm-dashboard/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex/:subChildTab',
    component: CommDashboardComponent
  },
  {
    path: 'policy-issues/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex/:subChildTab',
    component: PolicyIssuesComponent
  },
  {
    path: 'import-policy/:ParentTab/:pageSize/:pageIndex',
    component: ImportPolicyComponent,
    canDeactivate: [AuthGuard],
  }
  ,
  // {
  //   path: 'advance-Search/:ClientId/:ParentTab/:pageSize/:pageIndex',
  //   component: PolicyAdvanceSearchComponent
  // },
  {
    path: 'advance-Search/:ParentTab/:pageSize/:pageIndex',
    component: PolicyAdvanceSearchComponent
  },
  {
    path: 'advance-Search/smartFields/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: PolicySmartFieldsComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'advance-Search/PolicyNotes/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex',
    component: PolicyNoteComponent,
    canDeactivate: [AuthGuard]
  },
  {
    path: 'advance-Search/comm-dashboard/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex/:subChildTab',
    component: CommDashboardComponent
  },
  {
    path: 'advance-Search/policy-issues/:ClientId/:PolicyId/:ParentTab/:childTab/:pageSize/:pageIndex/:subChildTab',
    component: PolicyIssuesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyManagerRoutingModule { }
