import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.userService.tokenValidation()
            .pipe(tap(isAuth => {
                if (!isAuth) {
                    this.router.navigateByUrl('/auth/login');
                }
            }));
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
        return this.userService.tokenValidation()
            .pipe(tap(isAuth => {
                if (!isAuth) {
                    this.router.navigateByUrl('/auth/login');
                }
            }));
    }

}
