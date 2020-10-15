import { environment } from '../../environments/environment';
import { IAPIUser, IAPIUserRef } from '../interfaces/api.interfaces';
const baseURL = environment.baseURL;

export class User {
    constructor(
        public name: string,
        public email: string,
        public id?: string,
        public role?: string,
        public status?: string,
        public google?: boolean,
        public createdOn?: Date,
        public updatedBy?: IAPIUserRef,
        public updatedOn?: Date,
        public img?: string,
    ) { }

    public static createUserFromAPI(u: IAPIUser): User {
        const createdOn: Date = u.createdOn ? new Date(u.createdOn) : null;
        const updatedOn: Date = u.updatedOn ? new Date(u.updatedOn) : null;
        return new User(
            u.name, u.email, u.id, u.role, u.status, u.google, createdOn, u.updatedBy, updatedOn, u.img
        );
    }

    public set updateDate(updatedOn: number) {
        this.updatedOn = new Date(updatedOn);
    }

    public get roleName(): string {
        return this.role === 'USER_ROLE' ? 'Usuario' : 'Administrador';
    }

    public get urlImage(): string {
        if (this.img?.includes('https')) {
            return this.img;
        }
        return `${baseURL}/images/users/${this.img || 'no-image.png'}`;
    }

}
