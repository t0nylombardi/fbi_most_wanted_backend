import fetch from "node-fetch";
const BASE_FBI_URI = "https://api.fbi.gov/@wanted";
export async function fetchWantedList(params) {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_FBI_URI}?${query}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}
//# sourceMappingURL=fbiApi.js.map