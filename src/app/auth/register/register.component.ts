import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    readonly MAILREGEXP: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';

    public registerForm: FormGroup;
    public formSubmitted: false;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            name: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.pattern(this.MAILREGEXP)]),
            password: new FormControl('', Validators.required),
            password2: new FormControl('', Validators.required),
            condition: new FormControl(false)
        }, {
            validators: [this.passwordMatch(), this.acceptCondition()]
        });
    }

    get isValidName(): boolean {
        const field = this.registerForm.get('name');
        return field.valid && field.touched;
    }

    get isValidPassword2(): boolean {
        const pass1 = this.registerForm.get('password');
        const pass2 = this.registerForm.get('password2');
        return (!pass2.value ? false : pass2.value === pass1.value && pass1.valid);
    }

    /**
     * Validador que compara que las dos contraseñas sean iguales.
     */
    passwordMatch(): ValidatorFn {
        return (group: FormGroup) => {
            const pass1 = group.get('password').value;
            const pass2 = group.get('password2').value;
            if (pass1 === pass2) {
                return null;
            }
            return {
                noEquals: true
            };
        };
    }

    acceptCondition(): ValidatorFn {
        return (group: FormGroup) => {
            if (group.get('condition').value === true) {
                return { noEquals: true };
            }
            return null;
        };
    }

    register(): void {
        console.log(this.registerForm.value);
        if (this.registerForm.invalid) {
            Object.values(this.registerForm.controls).filter(c => c, invalid).forEach(c => {
                c.markAllAsTouched();
            });
        }
    }

}
