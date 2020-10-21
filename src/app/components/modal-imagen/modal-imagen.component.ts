import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { IAPISetImage } from '@interfaces/api.interfaces';
import { User } from '@models/user.model';
import { ImageService } from '@services/image.service';
import { ModalImagenService } from '@services/modal-imagen.service';

@Component({
    selector: 'app-modal-imagen',
    templateUrl: './modal-imagen.component.html',
    styleUrls: ['./modal-imagen.component.scss']
})
export class ModalImagenComponent implements OnInit {

    public imageUpdating = false;
    public imageFile: File = null;
    public newImage: string | ArrayBuffer = null;
    public user: User;

    constructor(
        public modalService: ModalImagenService,
        private toastService: ToastrService,
        public imageService: ImageService
    ) { }

    ngOnInit(): void {
    }

    /**
     * Ocula el modal.
     */
    public hide(): void {
        this.imageFile = null;
        this.newImage = null;
        this.imageUpdating = false;
        this.modalService.hideModal();
    }

    /**
     * Carga la imagen seleccionada.
     * @param files el archivo a subir.
     */
    public onFileChange(files): void {
        if (files && files[0]) {
            this.imageFile = files[0];
            const reader = new FileReader();
            reader.readAsDataURL(files[0]); // read file as data url
            reader.onload = () => {
                this.newImage = reader.result;
            };
        }
    }

    /**
     * Actualiza la imagen de un usuario, doctor u hospital.
     */
    public updateImage(): void {
        this.imageUpdating = true;
        const collection = this.modalService.collection;
        const entidad = this.modalService.entidad;

        this.imageService.updateImage(this.imageFile, collection, entidad.id)
            .then(resp => {
                if (resp.ok) {
                    const data = resp as IAPISetImage;
                    entidad.img = data.fileName;
                    this.toastService.info('Imagen actualizada!');
                    this.hide();
                } else {
                    this.toastService.error('¡Error al actualizar imagen!');
                    this.imageUpdating = false;
                }

            }).catch(err => {
                console.warn(err);
            });
    }

}
