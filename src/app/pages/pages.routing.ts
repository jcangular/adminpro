import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { SettingsComponent } from './settings/settings.component';

// Mantenimientos
import { UsersComponent } from './maintenance/users/users.component';


const routes: Routes = [{
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
        { path: 'progress', component: ProgressComponent, data: { title: 'Barra de Progreso' } },
        { path: 'grafica1', component: Grafica1Component, data: { title: 'Gráficas #1' } },
        { path: 'settings', component: SettingsComponent, data: { title: 'Configuración' } },
        { path: 'promesas', component: PromesasComponent, data: { title: 'Promesas' } },
        { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } },
        { path: 'profile', component: ProfileComponent, data: { title: 'Mi Perfil' } },

        // Mantenimientos
        { path: 'users', component: UsersComponent, data: { title: 'Usuarios' } },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
