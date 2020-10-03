import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {

    menu: any[] = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            menu: [
                { title: 'Principal', ruta: 'home' },
                { title: 'Progress', ruta: 'progress' },
                { title: 'Grafica', ruta: 'grafica1' },

            ]
        }
    ];

    constructor() { }
}
