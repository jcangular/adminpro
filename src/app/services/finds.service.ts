import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IAPIDoctor, IAPIFindDoctors, IAPIFindHospitals, IAPIFindUsers, IAPIHospital, IAPIResponse } from '../interfaces/api.interfaces';

const baseURL = environment.baseURL;


@Injectable({
    providedIn: 'root'
})
export class FindsService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Devuelve el token de la sesión activa.
     */
    private get token(): string {
        return sessionStorage.getItem('token') || '';
    }

    private get headers(): { headers: { 'x-token': string; }; } {
        return {
            headers: { 'x-token': this.token }
        };
    }

    public findByCollection(
        collection: 'users' | 'hospitals' | 'doctors',
        query: string,
        since: number = 0,
        limit: number = 0
    ): Observable<IAPIFindUsers | IAPIFindHospitals | IAPIFindDoctors> {
        const url = `${baseURL}/find/${query}?collection=${collection}&from=${since}&limit=${limit}`;
        return this.http.get(url, this.headers)
            .pipe(map(result => {
                switch (collection) {
                    case 'users':
                        return result as IAPIFindUsers;
                    case 'hospitals':
                        return result as IAPIFindHospitals;
                    case 'doctors':
                        return result as IAPIFindDoctors;
                }
            }));
    }

}
