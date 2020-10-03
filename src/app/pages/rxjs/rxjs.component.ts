import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, skip, map, filter } from 'rxjs/operators';

@Component({
    selector: 'app-rxjs',
    templateUrl: './rxjs.component.html',
    styles: [
    ]
})
export class RxjsComponent implements OnInit, OnDestroy {

    public intervalSubs: Subscription;

    constructor() {

        // this.getObservable().pipe(retry(3))
        //     .subscribe(
        //         valor => console.log('Subs:', valor),
        //         err => console.warn('[error]', err),
        //         () => console.log('[complete]')
        //     );

        this.intervalSubs = this.getInterval()
            .subscribe(console.log);

    }

    getInterval(): Observable<number> {
        return interval(250).pipe(
            map(n => n + 1),
            take(100),
            filter(n => n % 2 === 0)
        );
    }

    getObservable(): Observable<number> {
        let i = 0;
        return new Observable<number>(observer => {

            const intervalo = setInterval(() => {
                observer.next(i++);

                if (i === 2) {
                    observer.error(`i llegó al valor de ${i}`);
                }
                else if (i === 4) {
                    clearInterval(intervalo);
                    observer.complete();
                }
            }, 1000);
        });
    }


    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.intervalSubs.unsubscribe();
    }

}
