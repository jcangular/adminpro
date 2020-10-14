export interface IAPIResponse {
    ok: boolean;
    message: string;
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
