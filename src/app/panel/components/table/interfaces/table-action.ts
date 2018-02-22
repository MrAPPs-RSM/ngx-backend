export interface TableAction {
    content: string;
    config: {
        path?: string; // redirect to
        titleField?: string; // to avoid id in page title
        endpoint?: string; // api call
    };
}
