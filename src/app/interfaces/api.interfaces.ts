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

export interface IAPIGetUsers extends IAPIResponse {
    users: IAPIUser[];
    count: number;
    total: number;
}
