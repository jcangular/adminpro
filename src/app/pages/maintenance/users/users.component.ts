import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, of, Subscription } from 'rxjs';
import { catchError, debounceTime, filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { User } from '@models/user.model';
import { IAPIError, IAPIFindUsers, IAPIResponse } from '@interfaces/api.interfaces';
import { FindsService } from '@services/finds.service';
import { ModalImagenService } from '@services/modal-imagen.service';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styles: []
})
export class UsersComponent implements OnInit, OnDestroy {

    public users: User[] = [];
    public totalUser = 0;
    public since = 0;
    public readonly limit = 5;
    public loading = false;
    public searching = false;
    public query = '';

    public copySince = 0;

    public searchChange$: Subscription;

    constructor(
        private userService: UserService,
        private findsService: FindsService,
        private toastService: ToastrService,
        public modalService: ModalImagenService
    ) { }

    public get hasNext(): boolean {
        return this.since + this.limit < this.totalUser;
    }

    public get hasPrevious(): boolean {
        return this.since - this.limit >= 0;
    }

    public get showingEntries(): string {
        const to = `${Math.min(this.since + this.limit, this.totalUser)}`;
        return `Mostrando ${this.since + 1} a ${to} de ${this.totalUser} usuarios`;
    }

    public get userId(): string {
        return this.userService.user.id;
    }

    ngOnInit(): void {
        this.getUsers();
        this.searchListener();
    }

    ngOnDestroy(): void {
        this.searchChange$.unsubscribe();
    }

    private getUsers(): void {
        this.loading = true;
        this.userService.getUsers(this.since, this.limit).subscribe(
            ({ users, total }) => {
                this.users = users.map(u => User.createUserFromAPI(u));
                this.totalUser = total;
                this.copySince = this.since;
                this.loading = false;
            }, (err: IAPIError) => {
                console.warn(err);
                this.toastService.error(err.message, '', { timeOut: 3000 });
                this.loading = false;
            });
    }

    private startSearch(termino: string): void {
        this.searching = true;
        this.query = termino;
        this.since = 0;
        this.totalUser = 0;
    }

    private endSearch(): void {
        this.query = '';
        this.searching = false;
        this.since = this.copySince;
        this.getUsers();
    }

    /**
     * Realiza la busqueda de usuarios.
     */
    private searchListener(): void {
        const buscar = document.getElementById('txtSearchUser');

        this.searchChange$ = fromEvent<KeyboardEvent>(buscar, 'keyup')
            .pipe(
                debounceTime<KeyboardEvent>(300),
                pluck<KeyboardEvent, string>('target', 'value'),
                filter(termino => termino !== this.query),
                switchMap(termino => {
                    if (termino === null || termino.length === 0) {
                        return of(false);
                    }
                    this.loading = true;
                    this.startSearch(termino);
                    return this.findsService.findByCollection('users', termino, 0, this.limit).pipe(
                        map((result: IAPIFindUsers) => result),
                        catchError(err => of(err as IAPIError))
                    );
                })
            ).subscribe(result => {
                if (!result) {
                    this.endSearch();
                    this.loading = false;
                } else if ((result as IAPIResponse).ok === true) {
                    const data = result as IAPIFindUsers;
                    this.users = data.users.map(u => User.createUserFromAPI(u));
                    this.totalUser = data.totalUsers;
                    this.loading = false;
                } else {
                    const err = result as IAPIError;
                    if (err.statusText) {
                        this.users = [];
                        this.totalUser = 0;
                    } else {
                        this.toastService.error(err.message, '', { timeOut: 3000 });
                    }
                    this.loading = false;
                }
            });
    }

    /**
     * Obtiene los usuarios para la páginación cuando se está buscando.
     */
    private search(): void {
        if (!this.searching) {
            return;
        }
        this.loading = true;
        this.findsService.findByCollection('users', this.query, this.since, this.limit)
            .subscribe((data: IAPIFindUsers) => {
                this.users = data.users.map(u => User.createUserFromAPI(u));
                this.totalUser = data.totalUsers;
                this.loading = false;
            }, (err: IAPIError) => {
                this.since -= this.limit;
                this.toastService.error(err.message, '', { timeOut: 3000 });
                this.loading = false;
            });

    }

    /**
     * Obtiene los resultado de la siguiente página.
     */
    public toNext(): void {
        if (!this.hasNext) {
            return;
        }
        this.since += this.limit;
        this.searching ? this.search() : this.getUsers();
    }

    /**
     * Obtiene los resultados de la página anterior.
     */
    public toPrevious(): void {
        if (!this.hasPrevious) {
            return;
        }
        this.since -= this.limit;
        this.searching ? this.search() : this.getUsers();
    }

    /**
     * Borra un usuario.
     * @param user el usuario a eliminar.
     * @param i indice del arreglo de usuarios.
     */
    public deleteUser(user: User, i: number): void {

        if (user.id === this.userId) {
            return;
        }

        Swal.fire({
            title: '¿Borrar usuario?',
            text: `Estás a punto de eliminar a ${user.name.toUpperCase()}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e88e5',
            confirmButtonText: 'Si, ¡eliminalo!',
            cancelButtonColor: '#ef5350',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                this.loading = true;
                this.userService.deleteUser(user.id)
                    .subscribe(u => {
                        this.users[i] = u;
                        this.loading = false;
                        this.toastService.success('¡Usuario eliminado!', '', { timeOut: 1000 });
                    });
            }
        });
    }

    /**
     * Reactiva un usuario.
     * @param user el usuario a reactivar.
     * @param i indice del arreglo de usuarios.
     */
    public activeUser(user: User, i: number): void {

        if (user.id === this.userId) {
            return;
        }

        Swal.fire({
            title: '¿Activar usuario?',
            text: `Estás a punto de activar a ${user.name.toUpperCase()}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1e88e5',
            confirmButtonText: 'Si, ¡activalo!',
            cancelButtonColor: '#ef5350',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                this.loading = true;
                this.userService.activeUser(user.id)
                    .subscribe(u => {
                        this.users[i] = u;
                        this.loading = false;
                        this.toastService.success('¡Usuario activado!', '', { timeOut: 1000 });
                    });
            }
        });
    }

    /**
     * Cambia el rol de un usuario.
     * @param user el usuario a reactivar.
     * @param i indice del arreglo de usuarios.
     */
    public changeUserRole(user: User, i: number): void {
        this.userService.updateRoleUser(user.id, user.role)
            .subscribe(u => {
                this.users[i] = u;
                this.toastService.success('¡Role actualizado con exito!', '', { timeOut: 1000 });
            });
    }

    /**
     * Cambia la imagen de un usuario.
     * @param user el usuario a cambiar la imagen.
     */
    public changeImage(user: User): void {
        this.modalService.showModal('users', user);
    }

}
