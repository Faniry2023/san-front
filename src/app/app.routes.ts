import { Routes } from '@angular/router';
import { Formulaire } from './test/formulaire/formulaire';
import { Onebyone } from './test/onebyone/onebyone';
import { Map } from './map/map';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';

export const routes: Routes = [
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
        component:Login
    },
    {
        path: 'home',
        component:Home
    },
    {
        path: 'not-found',
        component:NotFound
    },

];
