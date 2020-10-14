import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

const datePipe: DatePipe = new DatePipe('es-HN');
const MAILREGEXP = '^[a-z0-9]([._\-]{0,1}[a-z0-9])*@[a-z0-9\-]+([.][a-z]{2,3}){1,3}$';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styles: [
    ]
})
export class ProfileComponent implements OnInit {

    public user: User;
    public userImage: string;
    public profileForm: FormGroup;


    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private toastService: ToastrService
    ) {
        this.user = this.userService.user;
        this.userImage = this.user.urlImage;
    }

    get lastUpdate(): string {
        return this.user.updatedOn ? datePipe.transform(this.user.updatedOn, 'd/MM/y h:mm:ss a') : '';
    }

    ngOnInit(): void {
        const dt = datePipe.transform(this.user.createdOn, 'd/MM/y h:mm:ss a');
        this.profileForm = this.fb.group({
            name: [this.user.name, Validators.required],
            email: [this.user.email, [Validators.required, Validators.pattern(MAILREGEXP)]],
            role: new FormControl({ value: this.user.roleName, disabled: true }),
            createdOn: new FormControl({
                value: datePipe.transform(this.user.createdOn, 'd/MM/y h:mm:ss a'),
                disabled: true
            })
        });
    }

    public onFileChange(event): void {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            reader.onload = (e) => { // called once readAsDataURL is completed
                this.userImage = e.target.result as string;
            };
        }
    }

    public updateProfile(): void {
        this.userService.updateUser(this.profileForm.value)
            .subscribe(() => {
                this.toastService.success('Información actualizada', 'Perfil', {
                    timeOut: 2000,
                    progressBar: true,
                    progressAnimation: 'increasing'
                });
            });
    }

}
