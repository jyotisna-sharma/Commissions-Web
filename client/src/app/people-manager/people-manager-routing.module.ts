import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleManagerListingComponent } from './people-manager-listing/people-manager-listing.component';
import { AddEditAgentComponent } from './add-edit-agent/add-edit-agent.component';
import { PeopleManagerPermissionsComponent } from './people-manager-permissions/people-manager-permissions.component';
import { UserMappingComponent } from './user-mapping/user-mapping.component'
import { PeopleManagerUserListingComponent } from './people-manager-user-listing/people-manager-user-listing.component';
import { DataEntryUserListingComponent } from './data-entry-user-listing/data-entry-user-listing.component';
import {AuthGuard} from '../_guards/auth.guard';
import { AddEditDataEntryUsersComponent } from '../people-manager/add-edit-data-entry-users/add-edit-data-entry-users.component'
const routes: Routes = [{
  path: '',
  component: PeopleManagerListingComponent,
  redirectTo: 'Agentlisting/1/10/0'
},
{
  path: 'Agentlisting/:ParentTab/:pageSize/:pageIndex',
  component: PeopleManagerListingComponent,
},
{
  path: 'Userlisting/:ParentTab/:pageSize/:pageIndex',
  component: PeopleManagerUserListingComponent,
},
{
  path: 'DataEntryUserList/:ParentTab/:pageSize/:pageIndex',
  component: DataEntryUserListingComponent,
},
{
  path: 'CreateNewAgent/:ParentTab',
  component: AddEditAgentComponent,
  canDeactivate: [AuthGuard],
},
{
  path: 'CreateNewUser/:ParentTab',
  component: AddEditAgentComponent,
  canDeactivate: [AuthGuard],
},
{
  path: 'AddEditAgent/:ParentTab/:childTab/:usercredentialId/:pageSize/:pageIndex',
  component: AddEditAgentComponent,
  data: { title: 'Forgot Username' },
  canDeactivate: [AuthGuard],
},
{
  path: 'EditSettings/:ParentTab/:childTab/:usercredentialId/:pageSize/:pageIndex',
  component: PeopleManagerPermissionsComponent,
  canDeactivate: [AuthGuard],
},
{
  path: 'UserMapping/:ParentTab/:childTab/:usercredentialId/:pageSize/:pageIndex',
  component: UserMappingComponent,
  canDeactivate: [AuthGuard],
},
{
  path: 'AddDataEntryUser/:ParentTab/:pageSize/:pageIndex',
  component: AddEditDataEntryUsersComponent,
  canDeactivate: [AuthGuard],
},
{
  path: 'EditDataEntryUser/:ParentTab/:usercredentialId/:pageSize/:pageIndex',
  component: AddEditDataEntryUsersComponent,
  canDeactivate: [AuthGuard],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleManagerRoutingModule { }
