import { Component } from '@angular/core';
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

    menu: any[];

    constructor(
        private sidebarService: SidebarService,
        private userService: UserService
    ) {
        this.menu = this.sidebarService.menu;
    }

    /**
     * Cierra la sesión de la aplicación.
     */
    public logOut(): void {
        this.userService.logOut();
    }


}
