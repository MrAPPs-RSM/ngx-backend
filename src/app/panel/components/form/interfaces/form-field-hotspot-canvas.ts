import {FormFieldHotspot} from './form-field-hotspot';

export interface FormFieldHotspotCanvas extends FormFieldHotspot {
    container: { width: number, height: number };
    hotspot: { width: number, height: number, previewImage: string };
}
