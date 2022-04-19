import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiListComponent } from './mi-list/mi-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MiButtonComponent } from './mi-button/mi-button.component';
import { MiAutocompleteComponent } from './mi-autocomplete/mi-autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PhoneInputComponent } from './phone-input/phone-input.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NumberDirective } from '../directives/numbers-only.directive';
import { NumberOnlyDirective } from '../directives/number.directive';
import { NumberFormatDirective } from '../directives/number-format.directive';
import { NumberWithDefaultDirective } from '../directives/number-with-default.directive';
import { NumberFormatPipe } from './Pipe/number-format.pipe';
import { CommissionDashboardListComponent } from './commission-dashboard-list/commission-dashboard-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SpecialCharacterDirective } from '../directives/special-chracter.directive';
import { CustomChartsComponent } from './custom-charts/custom-charts.component';
import { ChartsModule } from 'ng2-charts';
import { ScheduleSettingComponent } from './schedule-setting/schedule-setting.component';
import { MultipleCheckboxDropdownComponent } from './multiple-checkbox-dropdown/multiple-checkbox-dropdown.component';
import { FormatDatePipe, ConvertToDateFormat } from './Pipe/format-date.pipe';
import { AutocompleteDropdownComponent } from './autocomplete-dropdown/autocomplete-dropdown.component';

@NgModule({
  imports: [
    CommonModule, MatTableModule, MatMenuModule, MatIconModule,
    MatPaginatorModule, ChartsModule, MatSortModule, MatProgressSpinnerModule,
    MatSelectModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatAutocompleteModule, MatExpansionModule, ReactiveFormsModule, MatRadioModule,
    MatSlideToggleModule, MatCheckboxModule, FormsModule, Ng2TelInputModule,
    RouterModule, MatDatepickerModule
  ],
  exports: [
    MiListComponent, MiButtonComponent,
    MiAutocompleteComponent, SpecialCharacterDirective, ConvertToDateFormat,
    BreadcrumbComponent, PhoneInputComponent,
    NumberDirective, NumberOnlyDirective,
    NumberFormatDirective, NumberFormatPipe, FormatDatePipe,
    NumberWithDefaultDirective, CommissionDashboardListComponent, 
    CustomChartsComponent, ScheduleSettingComponent, MultipleCheckboxDropdownComponent
  ],
  declarations: [
    MiListComponent, MiButtonComponent,
    MiAutocompleteComponent, BreadcrumbComponent,
    PhoneInputComponent, NumberDirective,
    NumberOnlyDirective, SpecialCharacterDirective,
    NumberFormatDirective, NumberFormatPipe,
    NumberWithDefaultDirective, CommissionDashboardListComponent,
    CustomChartsComponent, ScheduleSettingComponent, MultipleCheckboxDropdownComponent, FormatDatePipe, ConvertToDateFormat, AutocompleteDropdownComponent]
})
export class SharedModule { }
