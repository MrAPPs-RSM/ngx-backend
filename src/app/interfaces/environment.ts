export type EnvAPI = {
    baseUrl: string;
    setupEndpoint: string;
    baseFilesUrl?: string;
}

export type Field = {
    key: string;
    type: string;
    label: string;
    placeholder?: string;
    validators?: {
        required: boolean;
    }
}

export type FieldType = {
    [name: string]: Array<Field>;
}

export type Button = {
    class: string;
    content: string;
    config: {
        path: string;
    }
}

export type LoginForm = {
    title: string;
    class: string;
    fields: FieldType;
    submit: {
        label: string;
    };
    buttons?: Array<Button>;
    isLoginForm: boolean;
}

export type AuthLogin = {
    endpoint: string;
    form: LoginForm;
    passwordResetEndpoint?: string;
}

export type EnvAuth = {
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
    production: boolean;
    name: string;
    logo: boolean;
    assets?: {
        logo: string;
        imageError: string;
    };
    googleMapsApiKey?: string;
    api: EnvAPI;
    domains?: boolean;
    auth: EnvAuth;
}