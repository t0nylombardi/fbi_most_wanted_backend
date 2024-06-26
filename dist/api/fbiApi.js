import fetch from "node-fetch";
const BASE_FBI_URI = "https://api.fbi.gov/@wanted";
export async function fetchWantedList(params) {
    const url = new URL(BASE_FBI_URI);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    const response = await fetch(url.toString());
    if (!response.ok)
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    return response.json();
}
//# sourceMappingURL=fbiApi.js.map