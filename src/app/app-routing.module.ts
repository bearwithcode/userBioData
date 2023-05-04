import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HistogramComponent } from './hostogram/histogram.component';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
  { path: 'login', component:  LoginComponent},
  { path: 'histogram', component: HistogramComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
