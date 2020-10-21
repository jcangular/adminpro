import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@models/user.model';
import { FindsService } from '@services/finds.service';
import { SettingsService } from '@services/settings.service';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public user: User;

    @ViewChild('txtGlobalSearch')
    inputSearch: ElementRef<HTMLInputElement>;

    constructor(
        public route: Router,
        public settingsService: SettingsService,
        private userService: UserService
    ) {
        this.user = userService.user;
    }

    logOut(): void {
        this.userService.logOut();
    }

    public search(query: string): void {
        if (query.trim().length === 0) { return; }
        this.route.navigate(['dashboard', 'search', query]);
    }

    public inputFocus(): void {
        setTimeout(() => this.inputSearch.nativeElement.select(), 10);
    }

}
