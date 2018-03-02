import {FormField} from './form-field';
import {isNullOrUndefined} from 'util';

export interface FormFieldFile extends FormField {
    options: {
        api: {
            upload: string;
            delete?: string;
        },
        maxFiles?: number; // only if multiple
        multiple?: boolean;
        allowedContentTypes?: string[];
    };
}

export interface UploadedFile {
    id: number;
    url?: string;
    name: string;
    type: string;
    container?: string;
}

export function isLocalStorageResponse(obj: any): obj is LocalStorageResponse {
    return !isNullOrUndefined(obj.id);
}

export function isGoogleCloudStorageResponse(obj: any): obj is GoogleCloudStorageResponse {
    return !isNullOrUndefined(obj.media);
}

/**
 * @supported only for old projects, is better to use GCS
 */
export interface LocalStorageResponse {
    id: number;
    container: string;
    name?: string;
    hash?: string;
    extension?: string;
    originalName: string;
    type: string;
    error?: {
        message?: string;
        name?: string;
        statusCode?: number;
    };
}

export interface GoogleCloudStorageResponse {
    container?: string;
    url?: string;
    file?: any;
    thumbnails?: {
        small?: string;
        big?: string;
        detail?: string;
    };
    media: {
        id?: number;
        name?: string;
        originalName?: string;
        mimeType?: string;
    };
}
