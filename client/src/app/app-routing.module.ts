/**
 * @author: Ankit.
 * @Name: app.module.
 * @description: facilite to routing to modules.
 * @dated: 20 Aug, 2018.
 * @modified: 3 Sep, 2018
**/

// Imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './secure/secure.component';
import { AuthGuard } from './_guards';
import { PeopleManagerModule } from './people-manager/people-manager.module';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
        data: { 'settingsBarHidden': true }
    },
    {
        path: 'dashboard',
        component: SecureComponent,
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard],
        data: { 'settingsBarHidden': '' }
    },
    {
        path: 'people',
        component: SecureComponent,
        loadChildren: () => import('./people-manager/people-manager.module').then(m => m.PeopleManagerModule),
        canActivate: [AuthGuard],
        data: { 'settingsBarHidden': true }
    },
    {
        path: 'client',
        component: SecureComponent,
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
        canActivate: [AuthGuard],
        data: { 'settingsBarHidden': true }
    },
    {
        path: 'policy',
        component: SecureComponent,
        loadChildren: () => import('./policy-manager/policy-manager.module').then(m => m.PolicyManagerModule),
        canActivate: [AuthGuard],
        data: { 'settingsBarHidden': true }
    },
    {
        path: 'settings',
        component: SecureComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        data: { 'settingsBarHidden': true }
    },
    {
        path: 'report-manager',
        component: SecureComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./report-manager/report-manager.module').then(m => m.ReportManagerModule),
    },
    {
        path: 'comp-manager',
        canActivate: [AuthGuard],
        component: SecureComponent,
        loadChildren: () => import('./comp-manager/comp-manager.module').then(m => m.CompManagerModule),
    },
    {
        path: 'config-manager',
        canActivate: [AuthGuard],
        component: SecureComponent,
        loadChildren: () => import('./config-manager/config-manager.module').then(m => m.ConfigurationModule)
    },
    {
        path: 'payor-tool',
        canActivate: [AuthGuard],
        component: SecureComponent,
        loadChildren: () => import('./payor-tool/payor-tool.module').then(m => m.PayorToolModule)
    },
    {
        path: 'data-entry-unit',
        canActivate: [AuthGuard],
        component: SecureComponent,
        loadChildren: () => import('./data-entry-unit/data-entry-unit.module').then(m => m.DataEntryUnitModule)
    },
    { path: '**', redirectTo: './authentication/authentication.module#AuthenticationModule' }
];
@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
})
export class AppRoutingModule { }
