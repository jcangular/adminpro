import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { IAPIError } from '../../../interfaces/api.interfaces';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

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


    constructor(
        private fb: FormBuilder,
        private hospitalService: HospitalService,
        private toastService: ToastrService,
        private modalService: ModalImagenService
    ) { }

    ngOnInit(): void {
        this.createAddForm();
        this.getHospitals();

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
    }

    private createAddForm(): void {
        this.addForm = this.fb.group({
            code: ['HTL-0007', [Validators.required, Validators.minLength(5)]],
            name: ['Hospital del Carmen', [Validators.required, Validators.minLength(5)]],
        });

        this.codeChange$ = this.addForm.get('code').valueChanges
            .subscribe(value => {
                if (this.uniqueValueError) {
                    this.uniqueValueError = false;
                    this.uniqueValueMessage = '';
                }
            });

    }

    public get hasNext(): boolean {
        return this.since + this.limit < this.totalHospitals;
    }

    public get hasPrevious(): boolean {
        return this.since - this.limit >= 0;
    }

    public get showingEntries(): string {
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

    /**
     * Obtiene el listado de hospitales según los parámetros de páginación.
     */
    private getHospitals(): void {
        this.loading = true;
        this.hospitalService.getHospitals(this.since, this.limit).subscribe(
            ({ hospitals, total }) => {
                this.hospitals = hospitals.map(h => Hospital.transformHospital(h)); //.sort((a, b) => a.compare(b));
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
                this.toastService.success('¡Hospital creado!');
            }, (err) => {
                const error: IAPIError = err.error;
                if (error.type === 'UniqueValue') {
                    this.uniqueValueError = true;
                    this.uniqueValueMessage = error.message;
                }
                this.updating = false;
            });
    }

    public closeAddForm(): void {
        this.adding = false;
        this.uniqueValueError = false;
        this.uniqueValueMessage = '';
        this.addForm.reset();
    }

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

    public clickMe(): void {
        console.log(`click!!!`);
    }

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
        // this.searching ? this.search() : this.getUsers();
        this.getHospitals();
    }

    /**
     * Obtiene los resultados de la página anterior.
     */
    public toPrevious(): void {
        if (!this.hasPrevious) {
            return;
        }
        this.since -= this.limit;
        // this.searching ? this.search() : this.getUsers();
        this.getHospitals();
    }

    /**
     * Cambia la imagen de un usuario.
     * @param user el usuario a cambiar la imagen.
     */
    public changeImage(hospital: Hospital): void {
        this.modalService.showModal('hospitals', hospital);
    }

}
