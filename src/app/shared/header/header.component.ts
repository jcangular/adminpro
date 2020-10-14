import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    public user: User;

    constructor(
        public settingsService: SettingsService,
        private userService: UserService
    ) {
        this.user = userService.user;
    }

    logOut(): void {
        this.userService.logOut();
    }

}
