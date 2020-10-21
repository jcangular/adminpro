import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { IAPIError, IAPIFindDoctors } from '@interfaces/api.interfaces';
import { Doctor } from '@models/doctor.model';
import { DoctorService } from '@services/doctor.service';
import { FindsService } from '@services/finds.service';
import { ModalImagenService } from '@services/modal-imagen.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-doctors',
    templateUrl: './doctors.component.html',
    styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit, OnDestroy {

    public doctors: Doctor[] = [];
    public totalDoctors = 0;

    public since = 0;
    public readonly limit = 5;

    public loading = false;
    public updating = false;
    public searching = false;

    public copySince = 0;

    public metaKey = false;
    public metaKeydown$: Subscription;
    public metaKeyup$: Subscription;

    private queryChanged: Subject<string> = new Subject<string>();
    public query = '';


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastService: ToastrService,
        private doctorService: DoctorService,
        private modalService: ModalImagenService,
        private findsService: FindsService
    ) { }

    public get hasNext(): boolean {
        return this.since + this.limit < this.totalDoctors;
    }

    public get hasPrevious(): boolean {
        return this.since - this.limit >= 0;
    }

    public get showingEntries(): string {
        if (this.totalDoctors === 0) {
            return `No hay resultados.`;
        }
        const to = `${Math.min(this.since + this.limit, this.totalDoctors)}`;
        return `Mostrando ${this.since + 1} a ${to} de ${this.totalDoctors} hospitales.`;
    }

    ngOnInit(): void {
        this.getDoctors();
        this.searchListenerInit();

        this.metaKeydown$ = fromEvent(document, 'keydown')
            .pipe(filter((event: KeyboardEvent) => event.key === 'Meta'))
            .subscribe(k => this.metaKey = true);

        this.metaKeyup$ = fromEvent(document, 'keyup')
            .pipe(filter((event: KeyboardEvent) => event.key === 'Meta'))
            .subscribe(k => this.metaKey = false);
    }

    ngOnDestroy(): void {
        this.metaKeydown$.unsubscribe();
        this.metaKeyup$.unsubscribe();
        this.queryChanged.unsubscribe();
    }

    /**
     * Obtiene el listado de doctores según los parámetros de páginación.
     */
    private getDoctors(): void {
        this.loading = true;
        this.doctorService.getDoctors(this.since, this.limit).subscribe(
            ({ doctors, total }) => {
                this.doctors = doctors.sort((a, b) => a.compare(b));
                this.totalDoctors = total;
                this.copySince = this.since;
                this.loading = false;
            }, (err: IAPIError) => {
                console.warn(err);
                this.toastService.error(err.message, '', { timeOut: 3000 });
                this.loading = false;
            }
        );
    }

    public onSearchChange(query: string): void {
        this.queryChanged.next(query.trim());
    }

    private searchListenerInit(): void {
        this.queryChanged
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
            ).subscribe(query => {
                if (!query) {
                    this.since = this.copySince;
                    this.searching = false;
                    this.getDoctors();
                } else {
                    this.since = 0;
                    this.searchDoctors();
                }
            });
    }

    /**
     * Busca los doctores por nombre.
     */
    private searchDoctors(): void {
        this.loading = true;
        this.searching = true;
        this.findsService.findByCollection('doctors', this.query, this.since, this.limit)
            .subscribe((result: IAPIFindDoctors) => {
                this.doctors = result.doctors.map(d => Doctor.transform(d));
                this.totalDoctors = result.totalDoctors;
                this.loading = false;
            }, (err) => {
                this.loading = false;
            });
    }

    /**
     * Agrega un doctor.
     */
    public add(): void {
        // const children = this.router.config.find(r => r.path === 'dashboard')[0].children;
        // const route = children.find(r => r.path === 'doctors/:id');
        // route.data.subTitle = ' | Creación';
        this.router.navigateByUrl(`/dashboard/doctors/new`);
    }

    /**
     * Elimina o inactiva el doctor seleccionado.
     * Nota: Si se tiene presionado la tecla `Meta`, el doctor es borrado por completo.
     * @param doctor El doctor a eliminar.
     * @param i índice (posición) del doctor en el arreglo.
     */
    public async delete(doctor: Doctor, i: number): Promise<void> {
        this.updating = true;
        const permanent = this.metaKey;
        Swal.fire({
            title: '¿Borrar hospital?',
            text: `Estás a punto de eliminar a ${doctor.name.toUpperCase()}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e88e5',
            confirmButtonText: 'Si, ¡eliminalo!',
            cancelButtonColor: '#ef5350',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                this.doctorService.deleteDoctor(doctor.id, permanent)
                    .subscribe(({ doctor: h, deleted }) => {
                        this.toastService.success('¡Doctor eliminado!');
                        if (deleted) {
                            this.doctors.splice(i, 1);
                            this.totalDoctors--;
                        } else {
                            this.doctors[i] = h;
                        }
                        this.updating = false;
                    });
            } else {
                this.updating = false;
            }
        });
    }

    /**
     * Reactiva el doctor seleccionado.
     * @param doctor El doctor a reactivar después de ser borrado (inactivado).
     * @param i índice (posición) del hospital en el arreglo.
     */
    public active(doctor: Doctor, i: number): void {
        this.updating = true;
        this.doctorService.activeDoctor(doctor.id)
            .subscribe(h => {
                this.doctors[i] = h;
                this.toastService.success('¡Doctor activado!');
                this.updating = false;
            });
    }

    /**
     * Obtiene los resultado de la siguiente página.
     */
    public toNext(): void {
        if (!this.hasNext) {
            return;
        }
        this.since += this.limit;
        this.searching ? this.searchDoctors() : this.getDoctors();
    }

    /**
     * Obtiene los resultados de la página anterior.
     */
    public toPrevious(): void {
        if (!this.hasPrevious) {
            return;
        }
        this.since -= this.limit;
        this.searching ? this.searchDoctors() : this.getDoctors();
    }

    /**
     * Cambia la imagen de un doctor.
     * @param doctor el doctor a cambiar la imagen.
     */
    public changeImage(doctor: Doctor): void {
        this.modalService.showModal('doctors', doctor);
    }

}
