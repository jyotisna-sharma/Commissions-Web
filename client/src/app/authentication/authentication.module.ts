import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetUsernameComponent } from './reset-username/reset-username.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationUrlService } from './authentication-url.service';
import { AuthenticationValidationMessageService } from './authentication-validation-message.service';
import { PreLoginHeaderComponent } from '../layouts/pre-login-header/pre-login-header.component';
import {SharedModule} from '../shared/shared.module';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    SharedModule
  ],
  entryComponents: [LoginComponent],
  declarations: [LoginComponent, ForgotPasswordComponent, ResetPasswordComponent, PreLoginHeaderComponent,
    ForgotUsernameComponent, ResetUsernameComponent],
  bootstrap: [LoginComponent],
  providers: [AuthenticationUrlService, AuthenticationValidationMessageService]

})
export class AuthenticationModule {
}





