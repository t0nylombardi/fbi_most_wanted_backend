import { fetchWantedList } from "./fbiApi.js";
export async function fetchCaseOfTheWeek() {
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
            if (!data.items.length || caseOfTheWeek)
                break;
            page++;
        }
        catch (error) {
            console.error(`Error fetching page ${page}:`, error);
            break;
        }
    }
    return caseOfTheWeek;
}
//# sourceMappingURL=caseOfTheWeek.js.map