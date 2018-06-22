export let formConfig = {
    types: {
        TEXT: 'text',
        TEXTAREA: 'textarea',
        EMAIL: 'email',
        URL: 'url',
        COLOR: 'color',
        PASSWORD: 'password',
        NUMBER: 'number',
        CHECKBOX: 'checkbox',
        SELECT: 'select',
        SELECT_2: 'select2',
        DATE: 'date',
        DATE_RANGE: 'date_range',
        TIMETABLE: 'timetable',
        MAP: 'map',
        FILE: 'file',
        LIST_DETAILS: 'list_details',
        PLAIN: 'plain',
        PREVIEW: 'preview',
        GEOSEARCH: 'geosearch',
        CLOUDINARY: 'cloudinary',
    },
    noInputTypes: {
        SEPARATOR: 'separator',
        GALLERY: 'gallery'
    },
    validators: {
        REQUIRED: 'required',
        MIN_LENGTH: 'minLength',
        MAX_LENGTH: 'maxLength',
        PATTERN: 'pattern',
        MIN: 'min',
        MAX: 'max'
    },
    responseTypes: {
        TERMINAL: 'terminal'
    }
};

