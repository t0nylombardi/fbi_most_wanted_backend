import { writeDatabase } from "./database.js";
import { fetchWantedList } from "../api/fbiApi.js";
import { v4 as uuidv4 } from "uuid";
const CATEGORIES = {
    ten_most_wanted: "ten",
    fugitives: "fugitive",
    capitol_violence: "capitol_violence",
    terrorism: "terrorism",
    kidnappings_missing_persons: "kidnapping_missing",
    parental_kidnappings: "parental_kidnapping",
    seeking_info: "seeking_info",
};
export async function fetchCaseOfTheWeek() {
    let page = 1;
    let found = false;
    let caseOfTheWeek = null;
    while (!found) {
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
                    found = true;
                    caseOfTheWeek = { ...item, id: uuidv4() };
                    break;
                }
            }
            if (!data.items.length)
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
export async function checkAndUpdateDatabase(db, forceUpdate = false) {
    try {
        console.log("Checking database update status...");
        const updatedAt = new Date(db.updatedAt);
        const now = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        console.log(`Database last updated at: ${updatedAt}`);
        console.log(`Current time: ${now}`);
        if (forceUpdate || now.getTime() - updatedAt.getTime() > oneDayInMs) {
            console.log("Database update requested or outdated. Fetching new data...");
            const updatedDb = {
                ...db,
                updatedAt: new Date().toISOString(),
            };
            for (const [category, poster_classification] of Object.entries(CATEGORIES)) {
                try {
                    console.log(`Fetching data for category: ${category}`);
                    const data = await fetchWantedList({
                        pageSize: 20,
                        page: 1,
                        sort_on: "modified",
                        sort_order: "desc",
                        poster_classification,
                    });
                    updatedDb[category] = data.items.map((item) => ({
                        ...item,
                        id: uuidv4(),
                    }));
                }
                catch (error) {
                    console.error(`Error fetching ${category}:`, error);
                }
            }
            console.log("Fetching Case of the Week...");
            const caseOfTheWeek = await fetchCaseOfTheWeek();
            if (caseOfTheWeek) {
                updatedDb.case_of_the_week = caseOfTheWeek;
            }
            else {
                console.log("Case of the Week not found");
            }
            console.log("Updating database...");
            await writeDatabase(updatedDb);
            console.log("Database updated successfully");
            return "Database updated successfully";
        }
        else {
            console.log("Database is up-to-date");
            return "Database is up-to-date";
        }
    }
    catch (error) {
        console.error("Error checking or updating database:", error);
        throw new Error("Failed to check or update the database");
    }
}
//# sourceMappingURL=updateLogic.js.map