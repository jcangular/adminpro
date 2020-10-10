import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { LoginForm } from '../interfaces/login.form';
import { RegisterForm } from '../interfaces/register.form';

const baseURL = environment.baseURL;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private auth2: gapi.auth2.GoogleAuth;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.googleInit();
    }

    /**
     * Registra un nuevo usuario a la aplicación.
     * @param form contiene el formulario de registro.
     */
    registerUser(form: RegisterForm): Observable<any> {
        return this.http.post(`${baseURL}/users`, form)
            .pipe(tap((result: any) => {
                sessionStorage.setItem('token', result.token);
            }));
    }

    /**
     * Inicia sesión con correo y contraseña.
     * @param form contiene el formulario de inicio de sesión.
     */
    loginUser(form: LoginForm): Observable<any> {
        return this.http.post(`${baseURL}/auth/login`, form)
            .pipe(tap((result: any) => {
                sessionStorage.setItem('token', result.token);
                if (form.remember) {
                    localStorage.setItem('email', form.email);
                } else {
                    localStorage.removeItem('email');
                }
            }));
    }

    /**
     * Inicializa el GoogleAuth.
     */
    public googleInit(): Promise<gapi.auth2.GoogleAuth> {
        return new Promise(resolve => {
            gapi.load('auth2', () => {
                this.auth2 = gapi.auth2.init({
                    client_id: '707564336535-j96f2v4aj6hkvlimvegvniftqck81vsi.apps.googleusercontent.com',
                    cookie_policy: 'single_host_origin'
                });
                resolve(this.auth2);
            });
        });

    }

    /**
     * Hace login con Google Sign-In.
     * @param idToken es el token de Google.
     */
    loginGoogle(idToken: string): Observable<any> {
        return this.http.post(`${baseURL}/auth/google`, { token: idToken })
            .pipe(tap((result: any) => {
                sessionStorage.setItem('token', result.token);
            }));

    }

    /**
     * Valida y renueva el token (JWT) de la aplicación.
     */
    tokenValidation(): Observable<boolean> {
        const token = sessionStorage.getItem('token') || '';
        return this.http.get(`${baseURL}/auth/renew`, {
            headers: { 'x-token': token }
        }).pipe(
            tap((result: any) => sessionStorage.setItem('token', result.token)),
            map(result => true),
            catchError(err => from([false]))
        );
    }

    /**
     * Cierra la sesión y renueva el token de la aplicación.
     */
    async logOut(): Promise<void> {
        sessionStorage.removeItem('token');
        await this.auth2.signOut();
        this.router.navigateByUrl('/auth/login');
    }

}
