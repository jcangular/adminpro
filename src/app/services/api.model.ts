import { environment } from '../../environments/environment';

export const baseURL = environment.baseURL;

export class ApiService {

    /**
     * Devuelve el token de la sesión activa.
     */
    protected get token(): string {
        return sessionStorage.getItem('token') || '';
    }

    protected get options(): { headers: { 'x-token': string; }; } {
        return {
            headers: { 'x-token': this.token }
        };
    }

}