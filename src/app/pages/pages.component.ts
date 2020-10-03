import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

// Declara una función global.
// src/assets/js/custom.js
declare function customInit(): void;

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styles: []
})
export class PagesComponent implements OnInit {

    constructor(private settingsService: SettingsService) { }

    ngOnInit(): void {
        customInit();
    }
}
