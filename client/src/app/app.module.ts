
/**
 * @author: Ankit.
 * @Name: app.module.
 * @description: facilite to start the app.
 * @component count: 4.
 * @dated: 17 Aug, 2018.
 * @modified: 29 Aug, 2018
**/
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgBusyModule } from 'ng-busy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLeftNavigationComponent } from './layouts/admin-left-navigation/admin-left-navigation.component';
import { AdminHeaderComponent } from './layouts/admin-header/admin-header.component';
// import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { ErrorInterceptor } from './_helpers';
import { CookieService } from 'ngx-cookie-service';
import { SecureComponent } from './secure/secure.component';
import { Title, BrowserModule } from '@angular/platform-browser';
import { ErrorHandlerService } from './_services/error-handler.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AppLevelDataService } from './_services/app-level-data.service';
import { CanRedirectFromForm } from './_services/dialogboxes/can-redirect.service';
import { ShowConfirmationComponent } from './_services/dialogboxes/show-confirmation/show-confirmation.component'
import { MatDialogModule } from '@angular/material/dialog';
import { ResponsiveMultiMenuDrirective } from './layouts/pre-login-header/responsive-multi-menu.directive';
import { SuccessMessageComponent } from './_services/dialogboxes/success-message/success-message.component'
import { A11yModule } from '@angular/cdk/a11y';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DeviceDetectorModule } from 'ngx-device-detector';
// import {CommonDataService} from './_services/common-data.service';
// import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { SharedModule } from './shared/shared.module';
import { UploadFileComponent } from './_services/dialogboxes/upload-file/upload-file.component';
// import { FileUploadModule } from 'ng2-file-upload';
import { TimeoutInterceptor } from './_services/timeoutInterceptor.service';
import { ChartsModule } from 'ng2-charts';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/Icon';
import { MatListModule } from '@angular/material/List';
import { MatButtonModule } from '@angular/material/Button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ToggleClassDirective } from './layouts/admin-left-navigation/toggle-class.directive';
import { RemoveConfirmationComponent } from './_services/dialogboxes/remove-confirmation/remove-confirmation.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { LeavePageComponent } from './_services/dialogboxes/leave-page/leave-page.component';
import { ShowSessionPopupComponent } from './_services/dialogboxes/show-session-popup/show-session-popup.component';
import { ListingComponent } from './_services/dialogboxes/listing/listing.component';
import { MatExpansionModule } from '@angular/material/expansion';
// tslint:disable-next-line:max-line-length
import { CommissionDashboardPaymentsComponent } from './_services/dialogboxes/commission-dashboard-incomingPayments/commission-dashboard-incomingPayments.component';
import { CommissionDashboardReversePaymentComponent } from './_services/dialogboxes/commission-dashboard-reverse-payment/commission-dashboard-reverse-payment.component';
import { MarkedPaidBatchListComponent } from './_services/dialogboxes/marked-paid-batch-list/marked-paid-batch-list.component';
import { MultipleGridShownComponent } from './_services/dialogboxes/multiple-grid-shown/multiple-grid-shown.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LinkedPolicyPaymentComponent } from './_services/dialogboxes/linked-policy-payment/linked-policy-payment.component';
import { ActivatePolicyComponent } from './_services/dialogboxes/activate-policy/activate-policy.component';
import { SettingsOverwriteComponent } from './_services/dialogboxes/settings-overwrite/settings-overwrite.component';
import { EmailDialogComponent } from './_services/dialogboxes/email-dialog/email-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule, IConfig } from 'ngx-mask';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
// import { ChartModule } from 'angular-highcharts';
@NgModule({
  declarations: [
    AppComponent,
    AdminLeftNavigationComponent,
    AdminHeaderComponent,
    SecureComponent,
    ShowConfirmationComponent,
    ToggleClassDirective,
    ResponsiveMultiMenuDrirective,
    SuccessMessageComponent,
    RemoveConfirmationComponent,
    LeavePageComponent,
    ShowSessionPopupComponent,
    ListingComponent,
    CommissionDashboardReversePaymentComponent,
    CommissionDashboardPaymentsComponent,
    MarkedPaidBatchListComponent,
    UploadFileComponent,
    ActivatePolicyComponent,
    MultipleGridShownComponent,
    LinkedPolicyPaymentComponent,
    SettingsOverwriteComponent,
    EmailDialogComponent
  ],

  imports: [
    // FileUploadModule,
    MatAutocompleteModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgBusyModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    // ChartModule,
    ChartsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatButtonModule,
    //ScrollDispatchModule,
    MatExpansionModule,
    MatTabsModule,
    GooglePlaceModule,
    MatTooltipModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    A11yModule,
    Ng2TelInputModule,
    SharedModule,
    FormsModule,
    DeviceDetectorModule.forRoot(),
    ToastrModule.forRoot(
      {
        timeOut: 3000,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
      }
    ),
    NgxMaskModule.forRoot(options)
    // /ToastModule.forRoot()
  ],
  exports: [
    LeavePageComponent,
    ListingComponent,
    MatAutocompleteModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService, Title, ErrorHandlerService, AppLevelDataService, CanRedirectFromForm
  ],
  bootstrap: [AppComponent],
  entryComponents: [ShowConfirmationComponent, SuccessMessageComponent, UploadFileComponent, ActivatePolicyComponent,
    RemoveConfirmationComponent, LeavePageComponent, ShowSessionPopupComponent, ListingComponent,
    CommissionDashboardReversePaymentComponent, CommissionDashboardPaymentsComponent, MarkedPaidBatchListComponent,
    MultipleGridShownComponent, LinkedPolicyPaymentComponent, SettingsOverwriteComponent, EmailDialogComponent],
})
export class AppModule { }


