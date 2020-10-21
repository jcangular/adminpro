import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { delay, filter, map } from 'rxjs/operators';

import { IAPIDoctor, IAPIHospital, IAPIUser } from '@interfaces/api.interfaces';
import { FindsService } from '@services/finds.service';

@Component({
    selector: 'app-global-search',
    templateUrl: './global-search.component.html',
    styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {

    public hospitals: IAPIHospital[] = [];
    public doctors: IAPIDoctor[] = [];
    public users: IAPIUser[] = [];
    public loading = false;

    public showUsers = false;
    public showDoctors = false;
    public showHospitals = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private findService: FindsService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.activatedRoute.params
            .pipe(
                map<Params, string>(({ query }) => query),
                filter<string>(q => q.trim().length > 0)
            )
            .subscribe(query => {
                this.findService.findAll(query)
                    .subscribe(result => {
                        this.users = result.users;
                        this.doctors = result.doctors;
                        this.hospitals = result.hospitals;
                        this.loading = false;
                    }, err => this.loading = false);
            });
    }

}
