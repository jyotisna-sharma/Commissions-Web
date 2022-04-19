/**
 * @author: Ankit.
 * @Name: authentication-routing.module.
 * @description: Provide the routing of components of authentication module.
 * @dated: 20 Aug, 2018.
 * @modified: 20 Aug, 2018
**/

// Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetUsernameComponent } from './reset-username/reset-username.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../_guards';

// Set routing of Login module
const routes: Routes = [
    // set path of login component of authentication module.
    {
        path : '',
        component: LoginComponent,
        data: {title: 'Commission Dept Login'},
    },
    {
        path : 'login',
        component: LoginComponent,
        data: {title: 'Commission Dept Login'},
    },
    // set path of forgot component of authentication module.
    {
        path : 'forgot',
        component: ForgotPasswordComponent,
        data: {title: 'Forgot Password'},
    },
    // set path of reset component of authentication module.
    {
        path : 'reset',
        component: ResetPasswordComponent,
        data: { 'settingsBarHidden': true }
    },
    {
        path : 'reset-uername',
        component: ResetUsernameComponent,
        canActivate: [AuthGuard],
        data: {title: 'Reset Username'},
    },
    {
        path : 'forgot-username',
        component: ForgotUsernameComponent,
        data: {title: 'Forgot Username'},
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
