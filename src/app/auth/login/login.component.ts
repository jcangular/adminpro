import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IAPIError } from '../../models/api.model';
import { UserService } from '../../services/user.service';

const MAILREGEXP = '^[a-z0-9]([._\-]{0,1}[a-z0-9])*@[a-z0-9\-]+([.][a-z]{2,3}){1,3}$';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    @ViewChild('inputMail') inputMail: ElementRef<HTMLInputElement>;
    @ViewChild('inputPassword') inputPassword: ElementRef<HTMLInputElement>;
    public doLogin = false;
    public loginForm: FormGroup;
    public auth2: gapi.auth2.GoogleAuth;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private ngZone: NgZone,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: [this.rememberEmail, [Validators.required, Validators.pattern(MAILREGEXP)]],
            password: ['', [Validators.required, Validators.minLength(5)]],
            remember: [this.isRemember]
        });
        if (this.isRemember) {
            setTimeout(() => this.inputPassword.nativeElement.select(), 10);
        } else {
            setTimeout(() => this.inputMail.nativeElement.select(), 10);
        }
        this.renderGoogleButton();
    }

    get rememberEmail(): string {
        return localStorage.getItem('email') || '';
    }

    get isRemember(): boolean {
        return localStorage.getItem('email') ? true : false;
    }

    get isInvalidMail(): boolean {
        const field = this.loginForm.get('email');
        return field.invalid && this.doLogin;
    }

    get isInvalidPassword(): boolean {
        const field = this.loginForm.get('password');
        return field.invalid && this.doLogin;
    }

    /**
     * Inicia sesión en la aplicación.
     */
    login(): void {
        this.doLogin = true;
        if (this.loginForm.invalid) {
            // Object.values(this.loginForm.controls).filter(c => c.invalid).forEach(c => c.markAsTouched());
            return;
        }

        this.userService.loginUser(this.loginForm.value)
            .subscribe(result => {
                this.router.navigateByUrl('/');
            },
                (err) => {
                    // TODO: Controlar el error cuando el back-end no está disponible.
                    const error = err.error as IAPIError;
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error al iniciar sessión!',
                        text: error.message,
                        onAfterClose: () => setTimeout(() => this.inputMail.nativeElement.select(), 10)
                    });
                });
    }

    /**
     * Incluir el botón de Google Sign-In.
     */
    private renderGoogleButton(): void {
        gapi.signin2.render('my-signin2', {
            scope: 'profile email',
            width: 140,
            height: 50,
            theme: 'dark'
        });
        this.userService.googleInit()
            .then((googleAuth) => {
                this.auth2 = googleAuth;
                this.attachSignIn(document.getElementById('my-signin2'));
            });
    }

    /**
     * Maneja el evento click del botón de Google.
     * @param element donde se está renderizando el boton de SignIn con Google.
     */
    private attachSignIn(element: HTMLElement): void {
        this.auth2.attachClickHandler(element, { prompt: 'select_account' },
            (googleUser) => {
                const idToken = googleUser.getAuthResponse().id_token;
                this.userService.loginGoogle(idToken)
                    .subscribe(result => {
                        this.ngZone.run(() => this.router.navigateByUrl('/'));
                    });
            }, (error) => {
                console.warn(error);
            });
    }

}
