// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
    production: true,
    languages: [
        {
            name: 'Italiano',
            isoCode: 'it'
        }
    ],
    currentLang: 'it',
    name: 'Academy - Backend',
    api: {
        baseUrl: 'http://academy-api-test.mr-apps.com/api/',
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
                title: 'Academy - Login',
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
                isLoginForm: true
            }
        }
    },
    assets: {
        logo: false,
        imageError: '/assets/images/image-error.png'
    }
};
