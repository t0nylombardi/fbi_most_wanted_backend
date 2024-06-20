import fetch from "node-fetch";

const BASE_FBI_URI = "https://api.fbi.gov/@wanted";

type WantedListParams = {
  pageSize: number;
  page: number;
  sort_on: string;
  sort_order: string;
  poster_classification: string;
};

export async function fetchWantedList(params: WantedListParams): Promise<any> {
  const { pageSize, page, sort_on, sort_order, poster_classification } = params;
  const url = `${BASE_FBI_URI}?pageSize=${pageSize}&page=${page}&sort_on=${sort_on}&sort_order=${sort_order}&poster_classification=${poster_classification}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}
