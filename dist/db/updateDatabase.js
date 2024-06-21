import { readDatabase, writeDatabase } from "./database.js";
import { fetchWantedList } from "../api/fbiApi.js";
import { fetchCaseOfTheWeek } from "../api/caseOfTheWeek.js";
import { CATEGORIES } from "../constants/categories.js";
import { v4 as uuidv4 } from "uuid";
import { isDatabaseOutdated } from "../utils/dateUtils.js";
async function updateCategoryData(category, poster_classification) {
    try {
        const data = await fetchWantedList({
            pageSize: 20,
            page: 1,
            sort_on: "modified",
            sort_order: "desc",
            poster_classification,
            status: "na",
        });
        return data.items.map((item) => ({
            ...item,
            id: uuidv4(),
        }));
    }
    catch (error) {
        console.error(`Error fetching ${category}:`, error);
        return [];
    }
}
async function updateAllCategories() {
    const updatedData = {};
    for (const [category, poster_classification] of Object.entries(CATEGORIES)) {
        console.log(`Fetching data for category: ${category}`);
        updatedData[category] = await updateCategoryData(category, poster_classification);
    }
    return updatedData;
}
async function updateCaseOfTheWeek(db) {
    console.log("Fetching Case of the Week...");
    const caseOfTheWeek = await fetchCaseOfTheWeek();
    if (caseOfTheWeek) {
        db.case_of_the_week = [caseOfTheWeek];
    }
    else {
        console.log("Case of the Week not found");
        db.case_of_the_week = [];
    }
    return db;
}
export async function checkAndUpdateDatabase(forceUpdate = false) {
    let db;
    try {
        db = await readDatabase();
    }
    catch (error) {
        console.error("Error reading database:", error);
        throw new Error("Failed to read the database");
    }
    if (!db.updatedAt ||
        forceUpdate ||
        isDatabaseOutdated(new Date(db.updatedAt.date))) {
        console.log("Database update requested or outdated. Fetching new data...");
        console.log("Database update requested or outdated. Fetching new data...");
        let updatedDb = { ...db, updatedAt: { date: new Date().toISOString() } };
        try {
            const categoriesData = await updateAllCategories();
            updatedDb = { ...updatedDb, ...categoriesData };
        }
        catch (error) {
            console.error("Error updating categories:", error);
            throw new Error("Failed to update categories");
        }
        try {
            updatedDb = await updateCaseOfTheWeek(updatedDb);
        }
        catch (error) {
            console.error("Error updating Case of the Week:", error);
            throw new Error("Failed to update Case of the Week");
        }
        try {
            await writeDatabase(updatedDb);
            console.log("Database updated successfully");
            return "Database updated successfully";
        }
        catch (error) {
            console.error("Error writing database:", error);
            throw new Error("Failed to write the database");
        }
    }
    else {
        console.log("Database is up-to-date");
        return "Database is up-to-date";
    }
}
//# sourceMappingURL=updateDatabase.js.map