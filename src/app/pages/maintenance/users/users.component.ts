import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { catchError, debounceTime, filter, map, pluck, switchMap, tap } from 'rxjs/operators';
import { IAPIError, IAPIFindUsers } from '../../../interfaces/api.interfaces';
import { User } from '../../../models/user.model';
import { FindsService } from '../../../services/finds.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styles: [
    ]
})
export class UsersComponent implements OnInit {

    public users: User[] = [];
    public totalUser = 0;
    public since = 0;
    public readonly limit = 5;
    public loading = false;
    public searching = false;
    public query = '';

    public copyUsers: User[] = [];
    public copyTotalUser = 0;
    public copySince = 0;

    constructor(
        private userService: UserService,
        private findsService: FindsService
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

    ngOnInit(): void {
        this.getUsers();
        this.searchListener();
    }

    private makeACopy(): void {
        this.copyUsers = this.users;
        this.copyTotalUser = this.totalUser;
        this.copySince = this.since;
    }

    private getUsers(): void {
        this.loading = true;
        this.userService.getUsers(this.since, this.limit).subscribe(
            ({ users, total }) => {
                this.users = users.map(u => User.createUserFromAPI(u));
                this.totalUser = total;
                this.makeACopy();
            }, (err) => {
                console.log(err);
            }, () => this.loading = false);
    }

    private startSearch(termino: string): void {
        this.searching = true;
        this.query = termino;
        this.since = 0;
        this.totalUser = 0;
    }

    private endSearch(): void {
        this.users = this.copyUsers;
        this.totalUser = this.copyTotalUser;
        this.since = this.copySince;
        this.query = '';
        this.searching = false;
    }

    private searchListener(): void {
        const buscar = document.getElementById('txtBuscar');

        fromEvent<KeyboardEvent>(buscar, 'keyup')
            .pipe(
                debounceTime<KeyboardEvent>(300),
                pluck<KeyboardEvent, string>('target', 'value'),
                switchMap(termino => {
                    if (termino === null || termino.length === 0) {
                        return of({ users: [], total: -1 });
                    }
                    this.loading = true;
                    this.startSearch(termino);
                    return this.findsService.findByCollection('users', termino, 0, this.limit)
                        .pipe(
                            map((data: IAPIFindUsers) =>
                                ({ users: data.users, total: data.totalUsers })
                            ),
                            catchError(err => of({ users: [], total: 0 }))
                        );
                })
            ).subscribe(data => {
                if (data.total === -1) {
                    this.endSearch();
                    this.loading = false;
                } else {
                    this.users = data.users.map(u => User.createUserFromAPI(u));
                    this.totalUser = data.total;
                    this.loading = false;
                }
            });
    }

    private search(): void {
        // NOTA: No sucede
        if (!this.searching) {
            return;
        }
        this.loading = true;
        this.findsService.findByCollection('users', this.query, this.since, this.limit)
            .subscribe((data: IAPIFindUsers) => {
                this.users = data.users.map(u => User.createUserFromAPI(u));
                this.totalUser = data.totalUsers;
                this.loading = false;
            });

    }

    public toNext(): void {
        if (!this.hasNext) {
            return;
        }
        this.since += this.limit;
        this.searching ? this.search() : this.getUsers();
    }

    public toPrevious(): void {
        if (!this.hasPrevious) {
            return;
        }
        this.since -= this.limit;
        this.searching ? this.search() : this.getUsers();
    }

}
