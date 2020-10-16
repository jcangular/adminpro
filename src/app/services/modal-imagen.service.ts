import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { User } from '../models/user.model';

const baseURL = environment.baseURL;

@Injectable({
    providedIn: 'root'
})
export class ModalImagenService {

    private modalActive = false;
    public entidad: User;
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
        entidad: User
    ): void {
        console.log(`ModalImagenService[showModal]`);
        this.modalActive = true;
        this.collection = collection;
        this.entidad = entidad;
    }

    /**
     * Oculta el modal de actualización de la imagen.
     */
    public hideModal(): void {
        console.log(`ModalImagenService[showModal]`);
        this.entidad = null;
        this.collection = null;
        this.modalActive = false;
    }
}
