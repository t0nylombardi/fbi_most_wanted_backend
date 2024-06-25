import { fetchWantedList } from "./fbiApi.js";

/**
 * Fetches the case of the week by looping through pages until the subject is found.
 * @returns The case of the week data.
 */
export async function fetchCaseOfTheWeek(): Promise<any | null> {
  let page = 1;
  let caseOfTheWeek = null;

  while (true) {
    try {
      const data = await fetchWantedList({
        pageSize: 20,
        page,
        sort_on: "modified",
        sort_order: "desc",
        poster_classification: "default",
      });

      for (const item of data.items) {
        if (item.subjects && item.subjects.includes("Case of the Week")) {
          caseOfTheWeek = item;
          break;
        }
      }

      if (!data.items.length || caseOfTheWeek) break; // If no more items or found the case, stop the loop

      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }

  return caseOfTheWeek;
}
