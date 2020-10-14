export interface IAPIError {
    ok: boolean;
    message: string;
    type: string;
    code: number;
    fieldErrors?: any;
    exception?: any;
}