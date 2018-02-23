export interface TableAction {
    content: string;
    class?: string; // success | info | warning | danger | default
    config: {
        path?: string; // redirect to
        titleField?: string; // to avoid only id in page title
        endpoint?: string; // api call
    };
}
