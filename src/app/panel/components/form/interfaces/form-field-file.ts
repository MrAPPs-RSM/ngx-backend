import {FormField} from './form-field';

export interface FormFieldFile extends FormField {
    options: {
        api: {
            upload: string;
            uploadEndpoint?: string;
            addId: boolean;
        },
        maxFiles?: number; // only if multiple
        multiple?: boolean;
        canDrag?: boolean;
        mediaLibrary?: MediaLibraryOptions;
        allowedContentTypes?: string[];
        visibilityCondition?: any[];
    };
}

export interface UploadedFile {
    id: number;
    url?: string;
    type: string;
    name?: string;
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
    tags?: any[];
}

export interface CloudinaryField extends FormField {
    options: {
        api: {
            searchEndpoint: string;
            dataEndpoint: string;
            deleteTagsEndpoint: string;
            addTagsEndpoint: string;
        },
        page?: number;
        perPage?: number;
    };
}
