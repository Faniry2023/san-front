import { Routes } from '@angular/router';
import { Formulaire } from './test/formulaire/formulaire';
import { Onebyone } from './test/onebyone/onebyone';
import { Map } from './map/map';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';
import { loggedInGuard } from './guards/logged-in-guard';
import { loggedOutGuard } from './guards/logged-out-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'formulaire',
        component:Formulaire
    },
    {
        path: 'onebyone',
        component:Onebyone
    },
    {
        path: 'map',
        component:Map
    },
    {
        path: 'login',
        component:Login,
        canActivate:[loggedOutGuard]
    },
    {
        path: 'home',
        component:Home,
        // canActivate:[loggedInGuard]
    },
    {
        path: '**',
        component:NotFound
    },

];
