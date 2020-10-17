import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../environments/environment';
const baseURL = environment.baseURL;

@Pipe({
    name: 'image'
})
export class ImagePipe implements PipeTransform {

    transform(image: string, collection: 'users' | 'hospitals' | 'doctors'): string {

        if (image?.includes('http')) {
            return image;
        }

        return `${baseURL}/images/${collection || 'noimage'}/${image || 'no-image.png'}`;
    }

}
