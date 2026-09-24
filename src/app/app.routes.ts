import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { MainPage } from './pages/main-page/main-page';

export const routes: Routes = [

{ path: '' , redirectTo: 'home-page', pathMatch: 'full'},
{ path: 'home-page', component: HomePage},
{  path: 'main-page', component: MainPage}

];
