import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostDataEntryComponent } from './post-data-entry/post-data-entry.component';

const routes: Routes = [
  {
    path: '',
    component: PostDataEntryComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class DataEntryUnitRoutingModule { }
