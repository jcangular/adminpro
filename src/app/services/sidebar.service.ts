import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {

    menu: any[] = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            ruta: '/dashboard',
            menu: [
                { title: 'Principal', ruta: '' },
                { title: 'Grafica', ruta: 'grafica1' },
                { title: 'Progress', ruta: 'progress' },
                { title: 'Promesas', ruta: 'promesas' },
                { title: 'RxJs', ruta: 'rxjs' },
            ]
        },
        {
            title: 'Mantenimiento',
            // icon: 'mdi mdi-console',
            icon: 'fa fa-tasks',
            ruta: '/dashboard',
            menu: [
                { title: 'Usuarios', ruta: 'users' },
                { title: 'Hospitales', ruta: 'hospitals' },
                { title: 'Doctores', ruta: 'doctors' }
            ]

        }
    ];

    constructor() { }
}
