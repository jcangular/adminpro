import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { LoginForm } from '../interfaces/login.form';
import { RegisterForm } from '../interfaces/register.form';

const baseURL = environment.baseURL;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    registerUser(form: RegisterForm): Observable<any> {
        return this.http.post(`${baseURL}/users`, form)
            .pipe(tap((result: any) => {
                sessionStorage.setItem('token', result.token);
            }));
    }

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

    loginGoogle(idToken: string): Observable<any> {
        return this.http.post(`${baseURL}/auth/google`, { token: idToken })
            .pipe(tap((result: any) => {
                sessionStorage.setItem('token', result.token);
            }));

    }

}
