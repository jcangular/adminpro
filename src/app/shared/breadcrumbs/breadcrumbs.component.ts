import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styles: [
    ]
})
export class BreadcrumbsComponent implements OnDestroy {

    private routerSubs: Subscription;
    public title: string;
    public url: any[] = [];

    constructor(private router: Router) {
        this.getRouterData();
    }

    /**
     * 
     */
    private getRouterData(): void {
        this.routerSubs = this.router.events
            .pipe(
                filter(event => event instanceof ActivationEnd),
                filter((event: ActivationEnd) => event.snapshot.firstChild === null),
                // tap(console.log),
                map<ActivationEnd, any[]>(event => [event.snapshot.data, event.snapshot.url])
            )
            .subscribe((info) => {
                this.title = `${info[0].title}${info[0]?.subTitle || ''}`;
                this.url = info[1];
                document.title = `AdminPro | ${this.title}`;

            });
    }

    ngOnDestroy(): void {
        this.routerSubs.unsubscribe();
    }


}
