import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Doctor } from '../models/doctor.model';
import { Hospital } from '../models/hospital.model';

import { User } from '../models/user.model';

const baseURL = environment.baseURL;

@Injectable({
    providedIn: 'root'
})
export class ModalImagenService {

    private modalActive = false;
    public entidad: User | Hospital | Doctor;
    public collection: 'users' | 'doctors' | 'hospitals';

    constructor() { }

    public get isHidden(): boolean {
        return !this.modalActive;
    }

    public get isShowing(): boolean {
        return this.modalActive;
    }

    public get urlImage(): string {
        if (!this.entidad) {
            return `${baseURL}/images/noimage/no-image.png`;
        }
        return this.entidad.urlImage;
    }
    /**
     * Muestra el modal para actualizar una imagen.
     * @param collection el tipo de la entidad a actualizar la imagen.
     * @param entidad es un usuario, doctor u hospital.
     */
    public showModal(
        collection: 'users' | 'doctors' | 'hospitals',
        entidad: User | Hospital | Doctor
    ): void {
        this.modalActive = true;
        this.collection = collection;
        this.entidad = entidad;
    }

    /**
     * Oculta el modal de actualización de la imagen.
     */
    public hideModal(): void {
        this.entidad = null;
        this.collection = null;
        this.modalActive = false;
    }
}
