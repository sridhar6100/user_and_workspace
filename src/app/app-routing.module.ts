import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './User/user-login/user-login.component';
import { UserProfileComponent } from './User/user-profile/user-profile.component';
import { AuthGuard } from './auth.guard';
import { WorkspaceComponent } from './User/workspace/workspace.component';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { AdminAuthGuard } from './admin-auth.guard';

const routes: Routes = [
  {path: '',component:UserLoginComponent},
  {path: 'profile',component:UserProfileComponent,canActivate:[AuthGuard]},
  {path: 'workspace/:id',component:WorkspaceComponent,canActivate:[AuthGuard]},
  {path: 'admin',children:[
    {path: 'dashboard',component:AdminDashboardComponent,canActivate:[AdminAuthGuard]},
    {path: 'login',component:AdminLoginComponent},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
