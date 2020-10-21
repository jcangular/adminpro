import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { Notyf } from 'notyf';
import Swal from 'sweetalert2';

import { User } from '@models/user.model';
import { ImageService } from '@services/image.service';
import { UserService } from '@services/user.service';
import { IAPIError, IAPISetImage } from '@interfaces/api.interfaces';

const datePipe: DatePipe = new DatePipe('es-HN');
const MAILREGEXP = '^[a-z0-9]([._\-]{0,1}[a-z0-9])*@[a-z0-9\-]+([.][a-z]{2,3}){1,3}$';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styles: [
    ]
})
export class ProfileComponent implements OnInit, OnDestroy {

    @ViewChild('inputImage') inputImage: ElementRef<HTMLInputElement>;
    public user: User;

    public imageFile: File = null;
    public newImage: string | ArrayBuffer = null;
    public imageUpdating = false;

    public profileForm: FormGroup;
    public profileChanges: Subscription;
    public profileWasChange = false;
    public profileUpdating = false;

    public notify = new Notyf({
        duration: 2000,
        position: { x: 'right', y: 'top' },
        types: [
            { type: 'success', background: '#06d79c' }
        ]
    });


    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private toastService: ToastrService,
        private imageService: ImageService
    ) {
        this.user = this.userService.user;
    }

    get lastUpdate(): string {
        return this.user.updatedOn ? datePipe.transform(this.user.updatedOn, 'd/MM/y h:mm:ss a') : '';
    }

    get isNormalUser(): boolean {
        return this.user.role === 'USER_ROLE';
    }

    get canProfileUpdate(): boolean {
        return this.profileWasChange && this.profileForm.valid && !this.profileUpdating;
    }

    get canImageUpdate(): boolean {
        return this.imageFile && !this.imageUpdating;
    }

    ngOnInit(): void {
        const dt = datePipe.transform(this.user.createdOn, 'd/MM/y h:mm:ss a');
        this.profileForm = this.fb.group({
            name: [this.user.name, Validators.required],
            email: [this.user.email, [Validators.required, Validators.pattern(MAILREGEXP)]],
            role: [this.user.roleName],
            createdOn: [datePipe.transform(this.user.createdOn, 'd/MM/y h:mm:ss a')]
        });
        this.onProfileChanges();
    }

    ngOnDestroy(): void {
        this.profileChanges.unsubscribe();
    }

    private onProfileChanges(): void {
        this.profileChanges = this.profileForm.valueChanges
            .subscribe(changes => {
                const { name, email, role } = changes;
                this.profileWasChange = false;
                if (name !== this.user.name) {
                    this.profileWasChange = true;
                } else if (email !== this.user.email) {
                    this.profileWasChange = true;
                } else if (role !== this.user.roleName) {
                    this.profileWasChange = true;
                }
            });
    }

    public updateProfile(): void {
        this.profileUpdating = true;
        this.userService.updateUser(this.profileForm.value)
            .subscribe(
                () => {
                    this.toastService.info('¡Su perfil fue actualizado!');
                    this.profileWasChange = false;
                    this.profileUpdating = false;
                }, err => {
                    const error = err.error as IAPIError;
                    this.profileUpdating = false;
                    Swal.fire({ text: error.message, icon: 'error' });
                });
    }

    /**
     * Estable el archivo de la nueva imagen y carga temporalmente
     * la imagen para su previsualización.
     * @param files referencia al archivo de la nueva imagen.
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

    public updateImage(): void {
        this.imageUpdating = true;
        this.imageService.updateImage(this.imageFile, 'users', this.user.id)
            .then(resp => {
                this.imageUpdating = false;
                if (resp.ok) {
                    this.toastService.info('Imagen actualizada!');
                    const data = resp as IAPISetImage;
                    this.user.img = data.fileName;
                    this.user.updateDate = data.updatedOn;
                } else {
                    this.toastService.error('¡Error al actualizar imagen!');
                }
                this.restoreImage();
            }).catch(err => {
                console.warn(err);
                this.imageUpdating = false;
            });
    }

    /**
     * Limpia la previsualización de la nueva imagen, ya sea por qu se actualizó correctamente la imagen
     * o si se canceló el cambio de imagen.
     */
    public restoreImage(): void {
        this.inputImage.nativeElement.value = '';
        this.imageFile = null;
        this.newImage = null;
    }

}
