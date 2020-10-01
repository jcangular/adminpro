import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
<<<<<<< HEAD
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';

=======
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';

import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { Grafica1Component } from './pages/grafica1/grafica1.component';
import { PagesComponent } from './pages/pages.component';
>>>>>>> f3b86f8c42563daf32d79f1efb093f7888685ee0

@NgModule({
    declarations: [
        AppComponent,
<<<<<<< HEAD
        NopagefoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PagesModule,
        AuthModule,
=======
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        NopagefoundComponent,
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        ProgressComponent,
        Grafica1Component,
        PagesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
>>>>>>> f3b86f8c42563daf32d79f1efb093f7888685ee0
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
