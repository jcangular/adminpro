import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, filter, map, tap } from 'rxjs/operators';

import { Hospital } from '@models/hospital.model';
import { Doctor } from '@models/doctor.model';
import { HospitalService } from '@services/hospital.service';
import { DoctorService } from '@services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { IAPIError } from '../../../interfaces/api.interfaces';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

    public doctorForm: FormGroup;
    public hospitals: Hospital[] = [];
    public hospitalSelected: Hospital;
    public doctor: Doctor;
    public title = '';
    public loading = false;
    public saving = false;

    public uniqueValueError = false;
    public uniqueValueMessage = '';


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoutear: ActivatedRoute,
        private toastService: ToastrService,
        private hospitalService: HospitalService,
        private doctorService: DoctorService,
        private modalService: ModalImagenService
    ) { }

    public get isInvalidName(): boolean {
        if (!this.doctorForm) { return false; }
        const field = this.doctorForm.get('name');
        return field.invalid && field.touched;
    }

    public get isInvalidCode(): boolean {
        if (!this.doctorForm) { return false; }
        const field = this.doctorForm.get('code');
        return (field.invalid && field.touched);
    }


    ngOnInit(): void {
        this.getHospitals();
        this.initForm();
        this.activatedRoutear.params
            .pipe(
                map(({ id }) => id),
                tap(id => this.title = id === 'new' ? 'Agregar un nuevo doctor' : 'Actualización de información'),
                filter(id => id !== 'new')
            ).subscribe(id => this.getUser(id));
    }

    private getHospitals(): void {
        this.loading = true;
        this.hospitalService.getHospitals()
            .subscribe(({ hospitals }) => {
                this.hospitals = hospitals.filter(h => h.status === 'A');
                this.loading = false;
            });
    }

    private initForm(): void {
        this.doctorForm = this.fb.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            hospitalId: ['', Validators.required]
        });

        this.doctorForm.get('hospitalId').valueChanges
            .pipe(filter(id => id !== ''))
            .subscribe(id => this.hospitalSelected = this.hospitals.find(h => h.id === id));

        this.doctorForm.get('code').valueChanges
            .subscribe(value => {
                if (this.uniqueValueError) {
                    this.uniqueValueError = false;
                    this.uniqueValueMessage = '';
                }
            });
    }

    private getUser(id: string): void {
        this.loading = true;
        this.doctorService.getDoctor(id)
            .pipe(delay(100))
            .subscribe(doctor => {
                this.doctor = doctor;
                this.doctorForm.setValue(this.doctor.toBasicForm());
                if (doctor.isInactive) { this.doctorForm.disable({ onlySelf: false }); }
                this.loading = false;
            }, err => this.router.navigate(['dashboard', 'doctors'])
            );
    }

    public save(): void {
        this.saving = true;
        this.doctorForm.disable({ onlySelf: false });
        const { code, name, hospitalId } = this.doctorForm.value;
        if (this.doctor) {
            this.doctor.code = code;
            this.doctor.name = name;
            this.doctor.hospital.id = hospitalId;
            this.doctorService.updateDoctor(this.doctor)
                .subscribe(doctor => {
                    this.doctor = doctor;
                    this.toastService.success('¡Doctor actualizado!');
                    this.saving = false;
                    this.doctorForm.enable({ onlySelf: false });
                }, (err) => {
                    this.errorOnSave(err.error);
                });
        } else {
            this.doctorService.createDoctor(code, name, hospitalId)
                .subscribe(doctor => {
                    this.doctor = doctor;
                    this.toastService.success('¡Doctor creado!');
                    this.saving = false;
                    this.router.navigate(['dashboard', 'doctors', doctor.id]);
                }, (err) => {
                    this.errorOnSave(err.error);
                });
        }
    }

    private errorOnSave(error: IAPIError): void {
        this.doctorForm.enable({ onlySelf: false });
        if (error.type === 'UniqueValue') {
            this.uniqueValueError = true;
            this.uniqueValueMessage = error.message;
        } else {
            this.toastService.error('!Error al actualizar!');
        }
        this.saving = false;
    }

    private disableForm(): void {
        this.doctorForm.disable({ onlySelf: false });
    }

    public changeImage(): void {
        this.modalService.showModal('doctors', this.doctor);
    }

}
