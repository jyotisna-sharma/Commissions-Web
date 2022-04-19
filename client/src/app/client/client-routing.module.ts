import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientListingComponent } from './client-listing/client-listing.component';
import { CreateNewClientComponent } from './create-new-client/create-new-client.component';
import { AuthGuard } from '../../app/_guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: ClientListingComponent,
    redirectTo: 'clientListing/3/10/0'
  },
  {
    path: 'create-new/:ParentTab',
    component: CreateNewClientComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'create-new/:ParentTab/:pageSize/:pageIndex',
    component: CreateNewClientComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'edit-client/:ClientId/:ParentTab/:pageSize/:pageIndex',
    component: CreateNewClientComponent,
    canDeactivate: [AuthGuard],
  },
  {
    path: 'clientListing/:ParentTab/:pageSize/:pageIndex',
    component: ClientListingComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
