import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayorToolRoutingModule } from './payor-tool-routing.module';
import { PayorToolSettingsComponent } from './payor-tool-settings/payor-tool-settings.component';
import { PayorToolLeftNavigationComponent } from './payor-tool-left-navigation/payor-tool-left-navigation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { AngularDraggableModule } from 'angular2-draggable';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddFieldComponent } from './add-field/add-field.component';
import { PayorToolListComponent } from './payor-tool-list/payor-tool-list.component';
import { CopyTemplateComponent } from './copy-template/copy-template.component';
import { TestFormulaComponent } from './test-formula/test-formula.component';
import { ImportToolSettingsComponent } from './import-tool-settings/import-tool-settings.component';
import { ImportToolListingComponent } from './import-tool-listing/import-tool-listing.component';
import { AddEditPhraseComponent } from './add-edit-phrase/add-edit-phrase.component';
import { ImportToolStatmentListComponent } from './import-tool-statment-list/import-tool-statment-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ImportPaymentDataComponent } from './import-payment-data/import-payment-data.component';
@NgModule({
  declarations: [PayorToolSettingsComponent, PayorToolLeftNavigationComponent, PayorToolListComponent, AddFieldComponent,
    ImportToolSettingsComponent, ImportToolListingComponent,
    CopyTemplateComponent, TestFormulaComponent, AddEditPhraseComponent, ImportToolStatmentListComponent, ImportPaymentDataComponent],
  entryComponents: [CopyTemplateComponent, AddFieldComponent, TestFormulaComponent, AddEditPhraseComponent],

  imports: [
    CommonModule, MatPaginatorModule,
    FormsModule,
    SharedModule,
    PayorToolRoutingModule,
    MatTableModule, MatIconModule,
    MatSortModule, MatFormFieldModule,
    MatInputModule, MatCardModule,
    MatButtonModule, MatSelectModule,
    MatSlideToggleModule, MatMenuModule,
    MatDialogModule, MatProgressSpinnerModule,
    MatTooltipModule, MatTabsModule,
    MatRadioModule, MatDatepickerModule, DragDropModule,
    MatCheckboxModule
    , MatNativeDateModule, ReactiveFormsModule, AngularDraggableModule,
    MatProgressBarModule
  ]
})
export class PayorToolModule { }
