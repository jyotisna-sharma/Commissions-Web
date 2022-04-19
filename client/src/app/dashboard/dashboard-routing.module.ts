import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayDashboardComponent } from './display-dashboard/display-dashboard.component';

const routes: Routes = [
  {
  path: '',
   component: DisplayDashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
