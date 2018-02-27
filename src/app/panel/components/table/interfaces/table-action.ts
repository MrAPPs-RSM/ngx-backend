export interface TableAction {
    content: string;
    class?: string; // success | info | warning | danger | default
    config: {
        path?: string; // redirect to
        titleField?: string; // to avoid only id in page title
        endpoint?: string; // api call
        confirm?: boolean; // if true opens confirmation modal before api
        method?: string; // post | patch | put | delete
        body?: any; // body for post | patch | put
        refreshAfter?: boolean; // default = true, determines what to do after api
    };
}
