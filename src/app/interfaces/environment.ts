import { Language } from '../panel/services/language.service';

export interface EnvAPI {
    baseUrl: string;
    setupEndpoint: string;
    baseFilesUrl?: string;
}

export interface Field {
    key: string;
    type: string;
    label: string;
    placeholder?: string;
    validators?: {
        required: boolean;
    };
}

export interface FieldType {
    [name: string]: Array<Field>;
}

export interface Button {
    class: string;
    content: string;
    config: {
        path: string;
    };
}

export interface LoginForm {
    title: string;
    class: string;
    fields: FieldType;
    submit: {
        label: string;
    };
    buttons?: Array<Button>;
    isLoginForm: boolean;
}

export interface AuthLogin {
    endpoint: string;
    form: LoginForm;
    passwordResetEndpoint?: string;
}

export interface EnvAuth {
    passwordChange?: {
        endpoint: string;
        form: {
            class: string,
            title: string,
            fields: FieldType,
            submit: {
                label: string
            },
            buttons?: Array<Button>
        },
    };
    passwordReset?: {
        endpoint: string;
        form: {
            class: string,
            title: string,
            fields: FieldType,
            submit: {
                label: string
            },
            buttons?: Array<Button>
        },
    };
    credentials: {
        domain?: string;
        username: string;
        password: string;
    };
    tokenKey: 'access_token';
    refreshToken?: {
        endpoint: string;
    };
    login: AuthLogin;
    passwordResetEndpoint?: string;
}

export interface Environment {
    version: number|null;
    production: boolean;
    name: string;
    logo: boolean;
    currentLang: string;
    languages?: Language[];
    assets?: {
        logo: string;
        imageError: string;
    };
    googleMapsApiKey?: string;
    api: EnvAPI;
    domains?: boolean;
    auth: EnvAuth;
}
