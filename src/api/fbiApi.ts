import fetch from "node-fetch";

const BASE_FBI_URI = "https://api.fbi.gov/@wanted";

/**
 * Fetches the wanted list from the FBI API.
 * @param params - The parameters for the API request.
 * @returns The fetched data.
 */
export async function fetchWantedList(params: {
  pageSize: number;
  page: number;
  sort_on: string;
  sort_order: string;
  poster_classification: string;
  status?: string;
}): Promise<any> {
  const query = new URLSearchParams(params as any).toString();
  const url = `${BASE_FBI_URI}?${query}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json();
}
