import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styles: [
    ]
})
export class UsersComponent implements OnInit {

    public totalUser = 0;
    public users: User[] = [];
    public loading = false;
    public since = 0;
    public readonly limit = 5;

    constructor(
        private userService: UserService
    ) { }

    public get hasNext(): boolean {
        return this.since + this.limit <= this.totalUser;
    }

    public get hasPrevious(): boolean {
        return this.since - this.limit >= 0;
    }

    ngOnInit(): void {
        this.getUsers();
    }

    private getUsers(): void {
        this.loading = true;
        this.userService.getUsers(this.since, this.limit).subscribe(
            ({ users, total }) => {
                this.users = users.map(u => User.createUserFromAPI(u));
                this.totalUser = total;
                this.loading = false;
            }, (err) => {
                console.log(err);
                this.loading = false;
            });
    }

    public toNext(): void {
        if (!this.hasNext) {
            return;
        }
        this.since += this.limit;
        this.getUsers();
    }

    public toPrevious(): void {
        if (!this.hasPrevious) {
            return;
        }
        this.since -= this.limit;
        this.getUsers();
    }

}
