import { fetchWantedList } from "./fbiApi.js";
import { v4 as uuidv4 } from "uuid";
export async function fetchCaseOfTheWeek() {
    let page = 1;
    let caseOfTheWeek = null;
    while (!caseOfTheWeek) {
        const data = await fetchWantedList({
            pageSize: 20,
            page,
            sort_on: "modified",
            sort_order: "desc",
            poster_classification: "default",
        });
        for (const item of data.items) {
            if (item.subjects && item.subjects.includes("Case of the Week")) {
                caseOfTheWeek = { ...item, id: uuidv4() };
                break;
            }
        }
        if (!data.items.length)
            break;
        page++;
    }
    return caseOfTheWeek;
}
//# sourceMappingURL=caseOfTheWeek.js.map