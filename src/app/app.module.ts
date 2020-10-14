import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHN from '@angular/common/locales/es-HN';

registerLocaleData(localeHN);

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';


@NgModule({
    declarations: [
        AppComponent,
        NopagefoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PagesModule,
        AuthModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'es-HN' }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
