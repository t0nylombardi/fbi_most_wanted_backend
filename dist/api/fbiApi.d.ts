interface FetchParams {
    pageSize: number;
    page: number;
    sort_on: string;
    sort_order: string;
    poster_classification: string;
    status?: string;
}
export declare function fetchWantedList(params: FetchParams): Promise<any>;
export {};
