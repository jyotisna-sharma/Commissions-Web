
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PayorToolSettingsComponent } from './payor-tool-settings/payor-tool-settings.component';
import { PayorToolListComponent } from './payor-tool-list/payor-tool-list.component'
import { ImportToolSettingsComponent } from './import-tool-settings/import-tool-settings.component';
import { ImportToolListingComponent } from './import-tool-listing/import-tool-listing.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'payor-tool-listing/10/0',
  },
  {
    path: 'payor-tool-settings/:payorId/:TemplateId/:PayorName/:pageSize/:pageIndex',
    component: PayorToolSettingsComponent
  },

  {
    path: 'payor-tool-import-listing/:pageSize/:pageIndex/:payorId',
    component: ImportToolListingComponent
  },
  {
    path: 'payor-tool-import-listing/:pageSize/:pageIndex',
    component: ImportToolListingComponent
  },
  {
    path: 'payor-tool-listing/:pageSize/:pageIndex',
    component: PayorToolListComponent
  },
  {
    path: 'payor-tool-listing/:pageSize/:pageIndex/:payorId',
    component: PayorToolListComponent
  },
  {
    path: 'payor-tool-import-settings/:payorId/:TemplateId/:pageSize/:pageIndex',
    component: ImportToolSettingsComponent
  },

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PayorToolRoutingModule { }
