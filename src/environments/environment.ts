// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    lang: 'it',
    name: 'Ngx Backend',
    api: {
        baseFilesUrl: 'http://0.0.0.0:5555/files/output/',
        baseUrl: 'http://0.0.0.0:5555/api/',
        setupEndpoint: 'setup'
    },
    auth: {
        tokenKey: 'access_token',
        login: {
            endpoint: 'persons/login?include=user',
            form: {
                title: 'Ngx Backend - Login',
                class: 'col-sm-12 primary',
                fields: {
                    base: [
                        {
                            key: 'username',
                            type: 'text',
                            label: 'Username',
                            placeholder: 'Username',
                            validators: {
                                required: true
                            }
                        },
                        {
                            key: 'password',
                            type: 'password',
                            label: 'Password',
                            placeholder: 'Password',
                            validators: {
                                required: true,
                                minLength: 4
                            }
                        }
                    ],
                },
                submit: {
                    label: 'Login'
                },
                buttons: [
                    {
                        class: 'btn-sm btn-link no-padding',
                        content: 'Forgot password?',
                        config: {
                            path: '/password-reset'
                        }
                    }
                ],
                isLoginForm: true
            }
        },
        passwordReset: {
            endpoint: 'password_reset',
            form: {
                class: 'col-sm-12 primary',
                title: 'Ngx Backend - Password reset',
                fields: {
                    base: [
                        {
                            key: 'username',
                            type: 'text',
                            label: 'Username',
                            placeholder: 'Username',
                            validators: {
                                required: true
                            }
                        }
                    ],
                },
                submit: {
                    label: 'Reset password'
                },
                buttons: [
                    {
                        class: 'btn-sm btn-link no-padding',
                        content: 'Back to login',
                        config: {
                            path: '/login'
                        }
                    }
                ]
            }
        }
    }
};
