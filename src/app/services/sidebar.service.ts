import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {

    constructor(private userService: UserService) { }

    public get menu(): any[] {
        return this.userService.menu;
    }
}
