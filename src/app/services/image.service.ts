import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IAPIError, IAPISetImage } from '../models/api.model';

const baseURL = environment.baseURL;

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor() { }


    async updateImage(
        imageFile: File,
        colection: 'users' | 'doctors' | 'hospitals',
        id: string
    ): Promise<IAPIError | IAPISetImage> {

        const url = `${baseURL}/images/${colection}/${id}`;
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'x-token': sessionStorage.getItem('token') || ''
            },
            body: formData
        });
        return await response.json();
    }
}
