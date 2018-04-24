// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
    production: false,
    languages: [
        {
            name: 'Italiano',
            isoCode: 'it'
        },
        {
            name: 'English',
            isoCode: 'en'
        }
    ],
    currentLang: 'it',
    name: 'Ngx Backend',
    api: {
        baseUrl: 'http://192.168.0.131:5555/api/',
        setupEndpoint: 'setup'
    },
    auth: {
        credentials: {
            username: 'username',
            password: 'password'
        },
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
                        },
                        {
                            key: 'remember',
                            type: 'checkbox',
                            checked: false,
                            label: 'Remember me'
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
            endpoint: 'persons/resetPasswordRequest',
            form: {
                class: 'col-sm-12 primary',
                title: 'Ngx Backend - Password reset',
                fields: {
                    base: [
                        {
                            key: 'email',
                            type: 'email',
                            label: 'Email',
                            placeholder: 'Email',
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
        },
        passwordChange: {
            endpoint: 'persons/passwordChange',
            form: {
                class: 'col-sm-12 primary',
                title: 'Ngx Backend - Change password',
                fields: {
                    base: [
                        {
                            key: 'password',
                            type: 'password',
                            label: 'New password',
                            placeholder: 'Password',
                            validators: {
                                required: true
                            }
                        }
                    ],
                },
                submit: {
                    label: 'Change password'
                }
            }
        }
    },
    assets: {
        logo: false,
        imageError: '/assets/images/image-error.png'
    }
};
