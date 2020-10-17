import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IAPICRUDHospital, IAPIGetHospitals } from '../interfaces/api.interfaces';
import { Hospital } from '../models/hospital.model';

const baseURL = environment.baseURL;

@Injectable({
    providedIn: 'root'
})
export class HospitalService {

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

    /**
     * Obtiene el listado de hospitales.
     * @param since desde que número de registro.
     * @param limit cantidad de hospitales en la lista.
     */
    public getHospitals(since: number = 0, limit: number = 0): Observable<{ hospitals: Hospital[], total: number; }> {
        return this.http
            .get(`${baseURL}/hospitals?from=${since}&limit=${limit}`, this.headers)
            .pipe(
                // delay(500),
                map((result: IAPIGetHospitals) => (
                    {
                        hospitals: result.hospitals.map(h => Hospital.transformHospital(h)),
                        total: result.total
                    }
                ))
            );
    }

    /**
     * Crea un hospital y devuelve el resultado.
     * @param data contiene el código y nombre del hospital.
     */
    public createHospital(code: string, name: string): Observable<Hospital> {
        return this.http.post(`${baseURL}/hospitals`, { code, name }, this.headers)
            .pipe(
                // delay(5000),
                map((result: IAPICRUDHospital) => Hospital.transformHospital(result.hospital))
            );
    }

    /**
     * Crea un hospital y devuelve el resultado.
     * @param data contiene el código y nombre del hospital.
     */
    public updateHospital(hospital: Hospital): Observable<Hospital> {
        const { code, name, id } = hospital;
        return this.http.put(`${baseURL}/hospitals/${id}`, { code, name }, this.headers)
            .pipe(
                map((result: IAPICRUDHospital) => Hospital.transformHospital(result.hospital))
            );
    }

    /**
     * Reactiva un hospital que fue borrado previamente.
     * @param data contiene el código y nombre del hospital.
     */
    public activeHospital(id: string): Observable<Hospital> {
        return this.http.put(`${baseURL}/hospitals/active/${id}`, {}, this.headers)
            .pipe(
                map((result: IAPICRUDHospital) => Hospital.transformHospital(result.hospital))
            );
    }

    /**
     * Elimina (inactiva) un hospital.
     * @param data contiene el código y nombre del hospital.
     */
    public deleteHospital(id: string, permanent: boolean = false): Observable<{ hospital: Hospital; deleted: boolean; }> {
        const options = this.headers;
        if (permanent) {
            options.headers['x-permanent'] = 'true';
        }
        return this.http.delete(`${baseURL}/hospitals/${id}`, options)
            .pipe(
                map((result: IAPICRUDHospital) => (
                    {
                        hospital: Hospital.transformHospital(result.hospital),
                        deleted: result?.deleted || false
                    }
                ))
            );
    }

}
