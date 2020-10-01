import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Grafica1Component,
    ],
    exports: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Grafica1Component,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
    ]
})
export class PagesModule { }