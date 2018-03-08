export interface TableAction {
    name?: string;
    content: string;
    class?: string; // success | info | warning | danger | default
    enableOn?: boolean;
    visibleOn?: boolean;
    config: {
        path?: string; // redirect to
        titleField?: string; // to avoid only id in page title
        params?: {
            type?: string, // 'formParameters' | 'tableParameters'
            loadData?: true, // only for formsParameters, reload data based on id
            tableKey?: string; // if a table key need to be passed to a form
            formKey?: string; // key of the field that need to be evaluated with tableKey value
            filter?: string; // only if tableParameters, filter for get data
            id?: true, // if need to pass id
            endpoint?: string; // if endpoint call after navigate to form is different of the endpoint defined in that form
        }; // query params to pass to path
        endpoint?: string; // api call
        confirm?: boolean; // if true opens confirmation modal before api
        method?: string; // post | patch | put | delete
        refreshAfter?: boolean; // default = true, determines what to do after api,
        responseType?: string; // 'default' | 'file_download'
        file?: { // file to download configuration (only if response type == file_download)
            name?: string; // default = 'table'
            extension: string; // required (csv, txt, jpeg)
        }
    };
}
