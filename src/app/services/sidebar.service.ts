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
                { title: 'Principal', ruta: '', exact: true },
                { title: 'Grafica', ruta: 'grafica1', exact: false },
                { title: 'Progress', ruta: 'progress', exact: false },
                { title: 'Promesas', ruta: 'promesas', exact: false },
                { title: 'RxJs', ruta: 'rxjs', exact: false },
            ]
        },
        {
            title: 'Mantenimiento',
            // icon: 'mdi mdi-console',
            icon: 'fa fa-tasks',
            ruta: '/dashboard',
            menu: [
                { title: 'Usuarios', ruta: 'users', exact: false },
                { title: 'Hospitales', ruta: 'hospitals', exact: false },
                { title: 'Doctores', ruta: 'doctors', exact: false }
            ]

        }
    ];

    constructor() { }
}
