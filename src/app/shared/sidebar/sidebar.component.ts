import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [`
        .logout {
            cursor: pointer;
        }
    `]
})
export class SidebarComponent {

    public user: User;

    constructor(
        private sidebarService: SidebarService,
        private userService: UserService
    ) {
        this.user = userService.user;
    }

    public get menu(): any[] {
        return this.sidebarService.menu;
    }

    /**
     * Cierra la sesión de la aplicación.
     */
    public logOut(): void {
        this.userService.logOut();
    }


}
