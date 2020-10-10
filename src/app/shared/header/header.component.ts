import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    constructor(
        public settingsService: SettingsService,
        private userService: UserService
    ) { }

    logOut(): void {
        this.userService.logOut();
    }

}
