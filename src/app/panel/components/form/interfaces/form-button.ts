export interface FormButton {
    content: string;
    class?: string; // success | info | warning | danger | default
    config: {
        path?: string; // redirect to
        params?: any; // query params to pass to path
        endpoint?: string; // api call
        confirm?: boolean; // if true opens confirmation modal before api
        method?: string; // post | patch | put | delete
        body?: any; // body for post | patch | put
        refreshAfter?: boolean; // default = true, determines what to do after api,
        responseType?: string; // 'default' | 'file_download'
        file?: { // file to download configuration (only if response type == file_download)
            name?: string; // default = 'table'
            extension: string; // required (csv, txt, jpeg)
        }
    };
}
