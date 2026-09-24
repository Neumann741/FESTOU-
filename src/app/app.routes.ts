import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { MainPage } from './pages/main-page/main-page';
import { Vitrine } from './pages/vitrine/vitrine';
import { Login } from './componentes/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePage },
  { path: 'main-page', component: MainPage },
  {path: 'vitrine', component: Vitrine},
  { path: 'login', component: Login }
];
