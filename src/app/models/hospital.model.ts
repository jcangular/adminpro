import { environment } from '../../environments/environment';
import { IAPIHospital, IAPIUserRef } from '../interfaces/api.interfaces';

const baseURL = environment.baseURL;

export class Hospital {

    private change = false;
    private validName = false;
    private validCode = false;

    constructor(
        public codeX: string,
        public nameX: string,
        public id?: string,
        public status?: string,
        public createdBy?: IAPIUserRef,
        public createdOn?: Date,
        public updatedBy?: IAPIUserRef,
        public updatedOn?: Date,
        public deletedOn?: Date,
        public img?: string,
    ) {
        this.change = false;
        this.validName = nameX?.length > 0 ? true : false;
        this.validCode = codeX?.length > 0 ? true : false;
    }

    public static transformHospital(h: IAPIHospital): Hospital {
        const createdOn: Date = h.createdOn ? new Date(h.createdOn) : null;
        const updatedOn: Date = h.updatedOn ? new Date(h.updatedOn) : null;
        const deletedOn: Date = h.deletedOn ? new Date(h.deletedOn) : null;

        return new Hospital(
            h.code, h.name, h.id, h.status, h.createdBy, createdOn, h.updatedBy, updatedOn, deletedOn, h.img
        );

    }

    public get name(): string {
        return this.nameX;
    }

    public set name(name: string) {
        this.change = true;
        this.validName = name?.length > 0 ? true : false;
        this.nameX = name;
    }

    public get code(): string {
        return this.codeX;
    }

    public set code(code: string) {
        this.change = true;
        this.validCode = code?.length > 0 ? true : false;
        this.codeX = code;
    }

    public get wasChange(): boolean {
        return this.change;
    }

    public noChanges(): void {
        this.change = false;
    }

    public get isValidCode(): boolean {
        return this.validCode;
    }

    public codeIsInvalid(): void {
        this.validCode = false;
        setTimeout(() => {
            this.validCode = this.codeX?.length > 0 ? true : false;
        }, 5000);
    }

    public get isValidName(): boolean {
        return this.validName;
    }

    public get isValid(): boolean {
        return this.validCode && this.validName;
    }

    public get isInactive(): boolean {
        return this.status === 'I' ? true : false;
    }

    public get isActive(): boolean {
        return this.status === 'A' ? true : false;
    }

    public get urlImage(): string {
        if (this.img?.includes('https')) {
            return this.img;
        }
        return `${baseURL}/images/hospitals/${this.img || 'no-image.png'}`;
    }

    public compare(hospital: Hospital): number {
        return this.name.localeCompare(hospital.name);
    }
}
