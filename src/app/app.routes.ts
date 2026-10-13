import { Routes } from '@angular/router';
import { AgendaPage } from './pages/agenda-page/agenda-page';
import { NotificacoesPage } from './pages/notificacoes-page/notificacoes-page';
import { EditarPerfilPage } from './pages/editar-perfil-page/editar-perfil-page';
import { HomePage } from './pages/home-page/home-page';
import { MainPage } from './pages/main-page/main-page';
import { VitrinePage } from './pages/vitrine-page/vitrine-page';
import { LoginPage } from './pages/login-page/login-page';
import { CriarFestaPage } from './pages/criar-festa-page/criar-festa-page';
import { DetalhesFestaPage } from './pages/detalhes-festa-page/detalhes-festa-page';
import { PerfilPage } from './pages/perfil-page/perfil-page';
import { MinhasFestasPage } from './pages/minhas-festas-page/minhas-festas-page';
import { GaleriaPage } from './pages/galeria-page/galeria-page';
import { PlaylistPage } from './pages/playlist-page/playlist-page';

export const routes: Routes = [
  { path: 'agenda', component: AgendaPage },
  { path: 'notificacoes', component: NotificacoesPage },
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePage },
  { path: 'main-page', component: MainPage },
  { path: 'vitrine', component: VitrinePage },
  { path: 'criar-festa', component: CriarFestaPage },
  { path: 'editar-festa/:id', component: CriarFestaPage },
  { path: 'festa/:id', component: DetalhesFestaPage },
  { path: 'perfil', component: PerfilPage },
  { path: 'editar-perfil', component: EditarPerfilPage },
  { path: 'minhas-festas', component: MinhasFestasPage },
  { path: 'galeria/:id', component: GaleriaPage },
  { path: 'playlist/:id', component: PlaylistPage },
  { path: 'login', component: LoginPage },
  {
    path: 'mapa-page',
    loadComponent: () => import('./pages/mapa-page/mapa-page').then((m) => m.MapaPage),
  },
];
