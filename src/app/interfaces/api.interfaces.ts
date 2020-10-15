export interface IAPIResponse {
    ok: boolean;
    message?: string;
}

export interface IAPIError extends IAPIResponse {
    type: string;
    code: number;
    fieldErrors?: any;
    exception?: any;
}

export interface IAPISetImage extends IAPIResponse {
    fileName: string;
    updatedBy: string;
    updatedOn: number;
}

export interface IAPIUserRef {
    id: string;
    name: string;
    status: string;
    img?: string;
}

export interface IAPIUser {
    name: string;
    email: string;
    id?: string;
    role?: string;
    status?: string;
    google?: boolean;
    createdOn?: Date;
    updatedBy?: IAPIUserRef;
    updatedOn?: Date;
    img?: string;
}

export interface IAPIHospital {
    id?: string;
    code: string;
    name: string;
    status: string;
    createdBy?: IAPIUserRef;
    createdOn?: Date;
    updatedBy?: IAPIUserRef;
    updatedOn?: Date;
    img?: string;
}

export interface IAPIDoctor {
    id?: string;
    code: string;
    name: string;
    status: string;
    hospital?: any;
    createdBy?: IAPIUserRef;
    createdOn?: Date;
    updatedBy?: IAPIUserRef;
    updatedOn?: Date;
    img?: string;
}

export interface IAPIGetUsers extends IAPIResponse {
    users: IAPIUser[];
    count: number;
    total: number;
}

export interface IAPIGetHospitals extends IAPIResponse {
    hospitals: IAPIHospital[];
    count: number;
    total: number;
}

export interface IAPIFindUsers extends IAPIResponse {
    users: IAPIUser[];
    totalUsers: number;
}

export interface IAPIFindHospitals extends IAPIResponse {
    users: IAPIHospital[];
    totalHospitals: number;
}
export interface IAPIFindDoctors extends IAPIResponse {
    users: IAPIDoctor[];
    totalDoctors: number;
}

