import { fetchWantedList } from "./fbiApi.js";
import { v4 as uuidv4 } from "uuid";

export async function fetchDefaultAllPages(): Promise<any[]> {
  let page = 1;
  let allPages: any[] = [];

  while (true) {
    try {
      const data = await fetchWantedList({
        pageSize: 100,
        page,
        sort_on: "modified",
        sort_order: "desc",
        poster_classification: "default",
      });

      if (!data.items.length) break; // No more items

      allPages = allPages.concat(
        data.items.map((item: any) => ({
          ...item,
          id: uuidv4(),
        }))
      );

      page++;
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }

  return allPages;
}
