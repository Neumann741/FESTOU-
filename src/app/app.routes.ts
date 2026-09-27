import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { MainPage } from './pages/main-page/main-page';
import { Vitrine } from './pages/vitrine/vitrine';
import { Login } from './componentes/login/login';
import { CriarFesta } from './pages/criar-festa/criar-festa';
import { DetalhesFesta } from './pages/detalhes-festa/detalhes-festa';
import { Perfil } from './pages/perfil/perfil';
import { MinhasFestas } from './pages/minhas-festas/minhas-festas';
import { GaleriaPage } from './pages/galeria/galeria';
import { PlaylistPage } from './pages/playlist/playlist';

export const routes: Routes = [
  { path: 'mapa', loadComponent: () => import('./componentes/mapa/mapa').then(m => m.Mapa) },
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePage },
  { path: 'main-page', component: MainPage },
  {path: 'vitrine', component: Vitrine},
  { path: 'criar-festa', component: CriarFesta },
  { path: 'festa/:id', component: DetalhesFesta },
  { path: 'perfil', component: Perfil },
  { path: 'minhas-festas', component: MinhasFestas },
  { path: 'galeria/:id', component: GaleriaPage },
  { path: 'playlist/:id', component: PlaylistPage },
  { path: 'login', component: Login },
  { path: 'login', component: Login },
  { path: 'mapa-page', loadComponent: () => import('./pages/mapa-page/mapa-page').then(m => m.MapaPage) }
];
