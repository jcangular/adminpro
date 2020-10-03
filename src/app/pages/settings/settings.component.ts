import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { SettingsService, Theme } from '../../services/settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    private links: NodeListOf<HTMLAnchorElement>;
    darkMode: boolean;

    constructor(private settingsService: SettingsService) {
        this.darkMode = this.settingsService.isDarkMode;
    }

    ngOnInit(): void {
        this.links = document.querySelectorAll('.selector');
        this.settingsService.checkCurrentTheme(this.links);
    }

    /**
     * Evento para cambiar el tema de la aplicación.
     * @param theme nombre del tema.
     */
    changeColor(theme: Theme): void {
        this.settingsService.setTheme(theme);
        this.settingsService.checkCurrentTheme(this.links);
    }

    /**
     * Cambia el modo oscuro.
     */
    changeDark(): void {
        this.settingsService.setDarkMode(this.darkMode);
    }

}
