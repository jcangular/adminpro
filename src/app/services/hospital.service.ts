import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { ApiService, baseURL } from './api.model';
import { IAPICRUDHospital, IAPIGetHospitals } from '../interfaces/api.interfaces';
import { Hospital } from '../models/hospital.model';


@Injectable({
    providedIn: 'root'
})
export class HospitalService extends ApiService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    /**
     * Obtiene el listado de hospitales.
     * @param since desde que número de registro.
     * @param limit cantidad de hospitales en la lista.
     */
    public getHospitals(since: number = 0, limit: number = 0): Observable<{ hospitals: Hospital[], total: number; }> {
        return this.http
            .get(`${baseURL}/hospitals?from=${since}&limit=${limit}`, this.options)
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
     * @param code El código del hospital.
     * @param name El nombre del hospital.
     */
    public createHospital(code: string, name: string): Observable<Hospital> {
        return this.http.post(`${baseURL}/hospitals`, { code, name }, this.options)
            .pipe(
                // delay(5000),
                map((result: IAPICRUDHospital) => Hospital.transformHospital(result.hospital))
            );
    }

    /**
     * Actualiza un hospital y devuelve el resultado.
     * @param hospital contiene el código y nombre del hospital.
     */
    public updateHospital(hospital: Hospital): Observable<Hospital> {
        const { code, name, id } = hospital;
        return this.http.put(`${baseURL}/hospitals/${id}`, { code, name }, this.options)
            .pipe(
                map((result: IAPICRUDHospital) => Hospital.transformHospital(result.hospital))
            );
    }

    /**
     * Reactiva un hospital que fue inactivado previamente.
     * @param id El id del hospital.
     */
    public activeHospital(id: string): Observable<Hospital> {
        return this.http.put(`${baseURL}/hospitals/active/${id}`, {}, this.options)
            .pipe(
                map((result: IAPICRUDHospital) => Hospital.transformHospital(result.hospital))
            );
    }

    /**
     * Elimina o inactiva un hospital.
     * @param id El id del hospital.
     * @param permanent Indica si el hospital debe ser eliminado o sólo cambiar a estado inactivo.
     */
    public deleteHospital(id: string, permanent: boolean = false): Observable<{ hospital: Hospital; deleted: boolean; }> {
        const options = this.options;
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
