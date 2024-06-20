import fetch from "node-fetch";
const BASE_FBI_URI = "https://api.fbi.gov/@wanted";
export async function fetchWantedList(params) {
    const { pageSize, page, sort_on, sort_order, poster_classification } = params;
    const url = `${BASE_FBI_URI}?pageSize=${pageSize}&page=${page}&sort_on=${sort_on}&sort_order=${sort_order}&poster_classification=${poster_classification}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}
//# sourceMappingURL=fbiApi.js.map