import fetch from "node-fetch";

interface FetchParams {
  pageSize: number;
  page: number;
  sort_on: string;
  sort_order: string;
  poster_classification: string;
  status?: string;
}

const BASE_FBI_URI = "https://api.fbi.gov/@wanted";

export async function fetchWantedList(params: FetchParams): Promise<any> {
  const url = new URL(BASE_FBI_URI);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, (params as any)[key])
  );
  const response = await fetch(url.toString());
  if (!response.ok)
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  return response.json();
}
