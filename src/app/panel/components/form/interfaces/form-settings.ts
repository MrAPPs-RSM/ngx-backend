import {FormButton} from './form-button';

export interface FormSettings {
    api: {
        endpoint: string,
        filter?: string;
        listEndpoint?: string;
        ajaxFormEndpoint?: string;
    };
    putTranslationsFirst: boolean;
    putFilesOnLanguages?: boolean;
    copyOnLanguages?: boolean;
    fields: any;
    isEdit?: boolean;
    onlyView?: boolean; // does GET but does not allow submit
    submit?: {
        endpoint?: string; // endpoint to call after submit (if different from GET in edit forms)
        label?: string; // if not set: "Save"
        confirm?: boolean; // if true, show modal to confirm
        refreshAfter?: boolean; // default = false, determines what to do after submit
        redirectAfter?: string; // if set, redirect to a path after submit; may contain ":id" (replaced with the response's "id")
        // se impostato, alla redirectAfter viene aggiunto un query param "listParams" che filtra la lista di destinazione
        // per response[redirectAfterFilterKey] (stesso formato "where" usato dai bottoni tabella con params.filter.where,
        // es. "Sotto-codici" in setup.json) — utile per tornare a un elenco filtrato per il parent del record modificato.
        redirectAfterFilterKey?: string;
    };
    buttons?: FormButton[];
    responseType?: string; // 'default' | 'inline' | 'terminal'
    class?: string;
    title?: string;
    errors?: any[];
}
