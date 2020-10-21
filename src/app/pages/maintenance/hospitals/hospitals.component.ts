import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { IAPIError, IAPIFindHospitals } from '@interfaces/api.interfaces';
import { Hospital } from '@models/hospital.model';
import { FindsService } from '@services/finds.service';
import { HospitalService } from '@services/hospital.service';
import { ModalImagenService } from '@services/modal-imagen.service';

@Component({
    selector: 'app-hospitals',
    templateUrl: './hospitals.component.html',
    styleUrls: ['./hospitals.component.scss']
})
export class HospitalsComponent implements OnInit, OnDestroy {

    public hospitals: Hospital[] = [];
    public totalHospitals = 0;
    public since = 0;
    public readonly limit = 5;

    public loading = false;
    public updating = false;
    public searching = false;
    public adding = false;

    public copySince = 0;

    public addForm: FormGroup;
    public uniqueValueError = false;
    public uniqueValueMessage = '';
    public codeChange$: Subscription;

    public metaKey = false;
    public metaKeydown$: Subscription;
    public metaKeyup$: Subscription;

    private queryChanged: Subject<string> = new Subject<string>();
    public query = '';


    constructor(
        private fb: FormBuilder,
        private toastService: ToastrService,
        private hospitalService: HospitalService,
        private modalService: ModalImagenService,
        private findsService: FindsService
    ) { }

    public get hasNext(): boolean {
        return this.since + this.limit < this.totalHospitals;
    }

    public get hasPrevious(): boolean {
        return this.since - this.limit >= 0;
    }

    public get showingEntries(): string {
        if (this.totalHospitals === 0) {
            return `No hay resultados.`;
        }
        const to = `${Math.min(this.since + this.limit, this.totalHospitals)}`;
        return `Mostrando ${this.since + 1} a ${to} de ${this.totalHospitals} hospitales.`;
    }

    public get isInvalidName(): boolean {
        const field = this.addForm.get('name');
        return field.invalid && field.touched;
    }

    public get isInvalidCode(): boolean {
        const field = this.addForm.get('code');
        return (field.invalid && field.touched);
    }

    ngOnInit(): void {
        this.createAddForm();
        this.getHospitals();
        this.searchListenerInit();

        this.metaKeydown$ = fromEvent(document, 'keydown')
            .pipe(filter((event: KeyboardEvent) => event.key === 'Meta'))
            .subscribe(k => this.metaKey = true);

        this.metaKeyup$ = fromEvent(document, 'keyup')
            .pipe(filter((event: KeyboardEvent) => event.key === 'Meta'))
            .subscribe(k => this.metaKey = false);

    }

    ngOnDestroy(): void {
        this.codeChange$.unsubscribe();
        this.metaKeydown$.unsubscribe();
        this.metaKeyup$.unsubscribe();
        this.queryChanged.unsubscribe();
    }

    /**
     * Crea el formulario reactivo para la ventana donde se agregan nuevos hospitales.
     */
    private createAddForm(): void {
        this.addForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(4)]],
            name: ['', [Validators.required, Validators.minLength(4)]],
        });

        this.codeChange$ = this.addForm.get('code').valueChanges
            .subscribe(value => {
                if (this.uniqueValueError) {
                    this.uniqueValueError = false;
                    this.uniqueValueMessage = '';
                }
            });

    }

    /**
     * Obtiene el listado de hospitales según los parámetros de páginación.
     */
    private getHospitals(): void {
        this.loading = true;
        this.hospitalService.getHospitals(this.since, this.limit).subscribe(
            ({ hospitals, total }) => {
                this.hospitals = hospitals.sort((a, b) => a.compare(b));
                this.totalHospitals = total;
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
                    this.getHospitals();
                } else {
                    this.since = 0;
                    this.searchHospitals();
                }
            });
    }

    /**
     *
     */
    private searchHospitals(): void {
        this.loading = true;
        this.searching = true;
        this.findsService.findByCollection('hospitals', this.query, this.since, this.limit)
            .subscribe((result: IAPIFindHospitals) => {
                this.hospitals = result.hospitals.map(h => Hospital.transformHospital(h));
                this.totalHospitals = result.totalHospitals;
                this.loading = false;
            }, (err) => {
                this.loading = false;
            });
    }

    /**
     * Agrega un hospital.
     */
    public add(): void {
        this.updating = true;
        const code = this.addForm.get('code').value;
        const name = this.addForm.get('name').value;
        this.hospitalService.createHospital(code, name)
            .subscribe(h => {
                this.hospitals.push(h);
                this.totalHospitals++;
                this.adding = false;
                this.updating = false;
                this.addForm.reset();
                this.toastService.success('¡Hospital creado existosamente!');
            }, (err) => {
                const error: IAPIError = err.error;
                if (error.type === 'UniqueValue') {
                    this.uniqueValueError = true;
                    this.uniqueValueMessage = error.message;
                }
                this.updating = false;
            });
    }

    /**
     * Cierra la ventana y limpia el formulario donde se agrega un hospital.
     */
    public closeAddForm(): void {
        this.adding = false;
        this.uniqueValueError = false;
        this.uniqueValueMessage = '';
        this.addForm.reset();
    }

    /**
     * Actualiza el código o nombre del hospital.
     * @param hospital El hospital a actualizar.
     * @param i índice (posición) del hospital en el arreglo.
     */
    public save(hospital: Hospital, i: number): void {
        this.updating = true;
        this.hospitalService.updateHospital(hospital)
            .subscribe(h => {
                this.hospitals[i] = h;
                this.toastService.success('¡Hospital actualizado!');
                this.updating = false;
            }, (err) => {
                const error: IAPIError = err.error;
                if (error.code === 1012) {
                    hospital.codeIsInvalid();
                    this.toastService.error(error.message);
                }
                this.updating = false;
            });
    }

    /**
     * Elimina (inactiva) el hospital seleccionado.
     * Nota: Si se tiene presionado la tecla `Meta`, el hospital es borrado por completo.
     * @param hospital El hospital a eliminar.
     * @param i índice (posición) del hospital en el arreglo.
     */
    public async delete(hospital: Hospital, i: number): Promise<void> {
        this.updating = true;
        const permanent = this.metaKey;
        Swal.fire({
            title: '¿Borrar hospital?',
            text: `Estás a punto de eliminar a ${hospital.name.toUpperCase()}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e88e5',
            confirmButtonText: 'Si, ¡eliminalo!',
            cancelButtonColor: '#ef5350',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) {
                this.hospitalService.deleteHospital(hospital.id, permanent)
                    .subscribe(({ hospital: h, deleted }) => {
                        this.toastService.success('¡Hospital eliminado!');
                        if (deleted) {
                            this.hospitals.splice(i, 1);
                            this.totalHospitals--;
                        } else {
                            this.hospitals[i] = h;
                        }
                        this.updating = false;
                    });
            } else {
                this.updating = false;
            }
        });
    }

    /**
     * Reactiva el hospital seleccionado.
     * @param hospital El hospital a reactivar después de ser borrado (inactivado).
     * @param i índice (posición) del hospital en el arreglo.
     */
    public active(hospital: Hospital, i: number): void {
        this.updating = true;
        this.hospitalService.activeHospital(hospital.id)
            .subscribe(h => {
                this.hospitals[i] = h;
                this.toastService.success('¡Hospital activado!');
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
        this.searching ? this.searchHospitals() : this.getHospitals();
    }

    /**
     * Obtiene los resultados de la página anterior.
     */
    public toPrevious(): void {
        if (!this.hasPrevious) {
            return;
        }
        this.since -= this.limit;
        this.searching ? this.searchHospitals() : this.getHospitals();
    }

    /**
     * Cambia la imagen de un usuario.
     * @param user el usuario a cambiar la imagen.
     */
    public changeImage(hospital: Hospital): void {
        this.modalService.showModal('hospitals', hospital);
    }

}
