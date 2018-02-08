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
        DATE: 'date',
        DATE_RANGE: 'date_range',
        LAT_LNG: 'lat_lng',
        FILE: 'file',
        LIST_DETAILS: 'list_details',
        CALENDAR: 'calendar'
    },
    noInputTypes: {
        DIVIDER: 'divider'
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

