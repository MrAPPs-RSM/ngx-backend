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
            type?: string, // 'formParameters'
            loadData?: true, // only for formsParameters, reload data based on id
            filter?: string; // filter for get data on new table
            id?: string, // id to pass :id
            endpoint?: string; // if endpoint call after navigate to form is different of the endpoint defined in that form
            associateFields?: Association[];
        }; // query params to pass to path
        endpoint?: string; // api call
        confirm?: boolean; // if true opens confirmation modal before api
        method?: string; // post | patch | put | delete
        refreshAfter?: boolean; // default = true, determines what to do after api,
        responseType?: string; // 'file_download'
        file?: { // file to download configuration (only if response type == file_download)
            name?: string; // default = 'table'
            extension: string; // required (csv, txt, jpeg)
        }
    };
}

export interface Association {
    tableKey: string;
    formKey?: string;
    queryKey?: string;
}
