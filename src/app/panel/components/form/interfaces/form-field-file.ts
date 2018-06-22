import {FormField} from './form-field';

export interface FormFieldFile extends FormField {
    options: {
        api: {
            upload: string;
        },
        maxFiles?: number; // only if multiple
        multiple?: boolean;
        canDrag?: boolean;
        mediaLibrary?: MediaLibraryOptions;
        allowedContentTypes?: string[];
    };
}

export interface UploadedFile {
    id: number;
    url?: string;
    type: string;
}

export interface MediaLibraryOptions {
    endpoint: string;
}

// Query params to add to retrieve medias
export interface MediaLibraryParams {
    types?: any;
    search?: string;
    page?: number;
    perPage?: number;
    skipIds?: any;
}

export interface Media {
    id: number;
    type: string;
    url: string;
    name: string;
    selected?: boolean;
}

