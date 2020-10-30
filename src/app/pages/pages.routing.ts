import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

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
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';
import { GlobalSearchComponent } from './global-search/global-search.component';


const routes: Routes = [{
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
        { path: 'grafica1', component: Grafica1Component, data: { title: 'Gráficas #1' } },
        { path: 'profile', component: ProfileComponent, data: { title: 'Mi Perfil' } },
        { path: 'progress', component: ProgressComponent, data: { title: 'Barra de Progreso' } },
        { path: 'promesas', component: PromesasComponent, data: { title: 'Promesas' } },
        { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } },
        { path: 'search/:query', component: GlobalSearchComponent, data: { title: 'Búsqueda Global' } },
        { path: 'settings', component: SettingsComponent, data: { title: 'Configuración' } },

        // Mantenimientos
        { path: 'doctors', component: DoctorsComponent, data: { title: 'Administración de Doctores' } },
        { path: 'doctors/:id', component: DoctorComponent, data: { title: 'Administración de Doctores' } },
        { path: 'hospitals', component: HospitalsComponent, data: { title: 'Administración de Hospitales' } },

        // Rutas para administradores
        { path: 'users', canActivate: [AdminGuard], component: UsersComponent, data: { title: 'Administración de Usuarios' } },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
