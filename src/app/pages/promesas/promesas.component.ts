import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-promesas',
    templateUrl: './promesas.component.html',
    styles: [
    ]
})
export class PromesasComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {

        // const promesa = new Promise<string>((resolve, reject) => {
        //     if (false) {
        //         resolve('Hola Mundo');
        //     } else {
        //         reject('Algo salió mal!!!');
        //     }
        // });

        // promesa
        //     .then(mensaje => console.log(mensaje))
        //     .catch(err => console.error(err));

        // console.log('Fin del init');
        this.getUsuarios().then(users => console.log(users));

    }

    getUsuarios(): Promise<any[]> {
        return new Promise<any[]>(resolve => {
            fetch('https://reqres.in/api/users')
                .then(resp => resp.json())
                .then(body => resolve(body.data));
        });
    }

}
