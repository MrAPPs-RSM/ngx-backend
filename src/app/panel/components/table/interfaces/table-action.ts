export interface TableAction {
    name?: string;
    content: string;
    class?: string; // success | info | warning | danger | default
    enableOn?: any;
    visibleOn?: any;
    config: {
        path?: any; // redirect to
        idField?: string;
        tableField?: string; // replace path with data property
        titleField?: string; // to avoid only id in page title
        params?: {
            type?: string, // 'formParameters'
            loadData?: true, // only for formsParameters, reload data based on id
            filter?: string; // filter for get data on new table
            endpoint?: string; // if endpoint call after navigate to form is different of the endpoint defined in that form
            associateFields?: Association[];
        }; // query params to pass to path
        endpoint?: string; // api call
        endpointData?: string; // api data
        addFilters?: boolean; // useful for general actions, if filters need to be passed (eg: export csv)
        confirm?: boolean; // if true opens confirmation modal before api
        modal?: { // if confirm true, modal option to text
            delete?: { // TODO: support multiple methods if necessary
                title?: string;
                body?: string;
            }
        }
        method?: string; // post | patch | put | delete
        refreshAfter?: boolean; // default = true, determines what to do after api,
        responseType?: string; // 'file_download'
        forceDownload?: boolean;
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
