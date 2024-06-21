import fetch from "node-fetch";

const BASE_FBI_URI = "https://api.fbi.gov/@wanted";

type WantedListParams = {
  pageSize: number;
  page: number;
  sort_on: string;
  sort_order: string;
  poster_classification: string;
  status: string;
};

export async function fetchWantedList(params: WantedListParams): Promise<any> {
  const { pageSize, page, sort_on, sort_order, poster_classification } = params;
  const url = `${BASE_FBI_URI}?page=${page}&pageSize=${pageSize}&sort_on=${sort_on}&sort_order=${sort_order}&poster_classification=${poster_classification}&status=${params.status}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCaseOfTheWeek(): Promise<any | null> {
  let page = 1;
  let caseOfTheWeek = null;

  while (!caseOfTheWeek) {
    try {
      const data = await fetchWantedList({
        pageSize: 100,
        page,
        sort_on: "",
        sort_order: "desc",
        poster_classification: "",
        status: "",
      });

      if (!data.items.length) break;
      console.log("length of data.items: ", data.items.length);

      let foundCaseOfTheWeek = false;
      for (const item of data.items) {
        item.subjects.forEach((subject: string) => {
          console.log(`Subject: ${subject}`);
          if (subject.match(/Case of the Week/i)) {
            console.log(`\n\nCase of the Week found! ${subject}\n\n`);
            foundCaseOfTheWeek = true;
          }
        });
        if (foundCaseOfTheWeek) {
          break;
        }
      }

      console.log(`Fetching page ${page}...`);
      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }
}

fetchCaseOfTheWeek();
