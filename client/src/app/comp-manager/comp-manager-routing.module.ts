import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchManagerComponent } from './batch-manager/batch-manager.component';
import { LinkPaymentToPoliciesComponent } from './link-payment-to-policies/link-payment-to-policies.component';
import { LinkToExistingPolicyComponent } from './link-to-existing-policy/link-to-existing-policy.component';
const routes: Routes = [
  {
    path: '',
    component: BatchManagerComponent,
    redirectTo: 'batch-manager/1'
  },
  {
    path: 'batch-manager/:ParentTab',
    component: BatchManagerComponent
  },
  {
    path: 'link-policies/:ParentTab/:pageIndex/:pageSize',
    component: LinkPaymentToPoliciesComponent
  },
  {
    path: 'link-to-existing-policies/:PolicyId/:pageIndex/:pageSize/:ParentTab',
    component: LinkToExistingPolicyComponent
  }

]
@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompManagerRoutingModule { }
