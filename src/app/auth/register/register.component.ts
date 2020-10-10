import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    readonly MAILREGEXP: string = '^[a-z0-9]([._\-]{0,1}[a-z0-9])*@[a-z0-9\-]+([.][a-z]{2,3}){1,3}$';
    public doRegister = false;
    public registerForm: FormGroup;
    @ViewChild('inputMail') inputMail: ElementRef<HTMLInputElement>;
    @ViewChild('inputName') inputName: ElementRef<HTMLInputElement>;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.pattern(this.MAILREGEXP)]),
            password: new FormControl('', [Validators.required, Validators.minLength(5)]),
            password2: new FormControl('', [Validators.required, Validators.minLength(5)]),
            condition: new FormControl(false, Validators.requiredTrue)
        }, {
            validators: this.passwordMatch('password', 'password2')
        });
        setTimeout(() => this.inputName.nativeElement.select(), 10);
    }

    get isInvalidName(): boolean {
        const field = this.registerForm.get('name');
        return field.invalid && this.doRegister;
    }

    get isInvalidMail(): boolean {
        const field = this.registerForm.get('email');
        return field.invalid && this.doRegister;
    }

    get isInvalidPassword(): boolean {
        const field = this.registerForm.get('password');
        return field.invalid && this.doRegister;
    }

    get isValidPassword2(): boolean {
        const pass1 = this.registerForm.get('password').value;
        const pass2 = this.registerForm.get('password2');
        return pass1 === pass2.value && pass2.valid;
    }

    get isInvalidPassword2(): boolean {
        const pass1 = this.registerForm.get('password').value || 'a';
        const pass2 = this.registerForm.get('password2').value || 'b';
        return pass1 !== pass2 && this.doRegister;
    }

    get conditionNoAccept(): boolean {
        const field = this.registerForm.get('condition');
        return field.invalid && this.doRegister;
    }

    /**
     * Hace el registro del usuario.
     */
    register(): void {
        this.doRegister = true;
        if (this.registerForm.invalid) {
            // Object.values(this.registerForm.controls).filter(c => c.invalid).forEach(c => {
            //     c.markAllAsTouched();
            // });
            return;
        }

        this.userService.registerUser(this.registerForm.value)
            .subscribe(result => {
                this.router.navigate(['/']);
            }, ({ error }) => {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error al registrarte!',
                    text: error.error.msg,
                    onAfterClose: () => setTimeout(() => this.inputMail.nativeElement.select(), 10)
                });
            });
    }

    /**
     * Valida que las contraseñas coincidan al momento de hacer el registro.
     */
    private passwordMatch(field1: string, field2: string): ValidatorFn {
        return (group: FormGroup) => {
            const pass1 = group.controls[field1].value;
            const pass2 = group.controls[field2].value;
            if (pass1 === pass2) {
                return null;
            }
            return {
                noEquals: true
            };
        };
    }

}
