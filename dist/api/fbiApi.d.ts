type WantedListParams = {
    pageSize: number;
    page: number;
    sort_on: string;
    sort_order: string;
    poster_classification: string;
};
export declare function fetchWantedList(params: WantedListParams): Promise<any>;
export {};
