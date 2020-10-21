import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService, baseURL } from './api.model';
import { IAPICRUDDoctor, IAPIGetDoctors, IAPIGetDoctor } from '../interfaces/api.interfaces';
import { Doctor } from '../models/doctor.model';


@Injectable({
    providedIn: 'root'
})
export class DoctorService extends ApiService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    /**
     * Obtiene el listado de doctores.
     * @param since desde que número de registro.
     * @param limit cantidad de doctores en la lista.
     */
    public getDoctors(since: number = 0, limit: number = 0): Observable<{ doctors: Doctor[], total: number; }> {
        return this.http.get(`${baseURL}/doctors?from=${since}&limit=${limit}`, this.options)
            .pipe(
                map((result: IAPIGetDoctors) => (
                    {
                        doctors: result.doctors.map(d => Doctor.transform(d)),
                        total: result.total
                    }
                ))
            );
    }

    public getDoctor(id: string): Observable<Doctor> {
        return this.http.get(`${baseURL}/doctors/${id}`, this.options)
            .pipe(
                map((result: IAPIGetDoctor) => Doctor.transform(result.doctor))
            );
    }

    /**
     * Crea un doctor y devuelve el resultado.
     * @param code El código del doctor.
     * @param name El nombre del doctor.
     * @param hospitalId El id del hospital al cual está asociado.
     */
    public createDoctor(code: string, name: string, hospitalId: string): Observable<Doctor> {
        return this.http.post(`${baseURL}/doctors`, { code, name, hospitalId }, this.options)
            .pipe(
                // delay(5000),
                map((result: IAPICRUDDoctor) => Doctor.transform(result.doctor))
            );
    }

    /**
     * Actualiza un doctor y devuelve el resultado.
     * @param doctor contiene el código y nombre del doctor.
     */
    public updateDoctor(doctor: Doctor): Observable<Doctor> {
        const { code, name, id } = doctor;
        const { id: hospitalId } = doctor.hospital;
        return this.http.put(`${baseURL}/doctors/${id}`, { code, name, hospitalId }, this.options)
            .pipe(
                map((result: IAPICRUDDoctor) => Doctor.transform(result.doctor))
            );
    }

    /**
     * Reactiva un doctor que fue inactivado previamente.
     * @param id El id del doctor.
     */
    public activeDoctor(id: string): Observable<Doctor> {
        return this.http.put(`${baseURL}/doctors/active/${id}`, {}, this.options)
            .pipe(
                map((result: IAPICRUDDoctor) => Doctor.transform(result.doctor))
            );
    }

    /**
     * Elimina o inactiva un doctor.
     * @param id El id del doctor.
     * @param permanent Indica si el doctor debe ser eliminado o sólo cambiar a estado inactivo.
     */
    public deleteDoctor(id: string, permanent: boolean = false): Observable<{ doctor: Doctor; deleted: boolean; }> {
        const options = this.options;
        if (permanent) {
            options.headers['x-permanent'] = 'true';
        }
        return this.http.delete(`${baseURL}/doctors/${id}`, options)
            .pipe(
                map((result: IAPICRUDDoctor) => (
                    {
                        doctor: Doctor.transform(result.doctor),
                        deleted: result?.deleted || false
                    }
                ))
            );
    }

}
