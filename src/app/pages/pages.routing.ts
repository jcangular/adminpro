import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [{
    path: 'dashboard',
    component: PagesComponent,
    children: [
        { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
        { path: 'progress', component: ProgressComponent, data: { title: 'Barra de Progreso' } },
        { path: 'grafica1', component: Grafica1Component, data: { title: 'Gráficas #1' } },
        { path: 'settings', component: SettingsComponent, data: { title: 'Configuración' } },
        { path: 'promesas', component: PromesasComponent, data: { title: 'Promesas' } },
        { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
