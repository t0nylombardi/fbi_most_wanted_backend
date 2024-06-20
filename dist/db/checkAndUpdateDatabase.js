import fetch from "node-fetch";
import { promises as fs } from "fs";
import path from "path";
const BASE_FBI_URI = "https://api.fbi.gov/@wanted";
const CATEGORIES = {
    ten_most_wanted: "ten",
    wanted: "default",
    terrorist: "terrorist",
    seeking_information: "information",
    kidnappings: "kidnapping",
    missing_persons: "missing",
};
async function fetchWantedList(params) {
    const { pageSize, page, sort_on, sort_order, poster_classification } = params;
    const url = `${BASE_FBI_URI}?pageSize=${pageSize}&page=${page}&sort_on=${sort_on}&sort_order=${sort_order}&poster_classification=${poster_classification}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}
async function readDatabase(filePath) {
    const dbContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(dbContent);
}
async function writeDatabase(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
async function checkAndUpdateDatabase() {
    const dbPath = path.resolve("src/db.json");
    try {
        const db = await readDatabase(dbPath);
        const updatedAt = new Date(db.updatedAt.date);
        const now = new Date();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (now.getTime() - updatedAt.getTime() > oneDayInMs) {
            const updatedDb = {
                ...db,
                updatedAt: { date: new Date().toISOString() },
            };
            for (const [category, poster_classification] of Object.entries(CATEGORIES)) {
                try {
                    const data = await fetchWantedList({
                        pageSize: 20,
                        page: 1,
                        sort_on: "modified",
                        sort_order: "desc",
                        poster_classification,
                    });
                    updatedDb[category] = data.items;
                }
                catch (error) {
                    console.error(`Error fetching ${category}:`, error);
                }
            }
            await writeDatabase(dbPath, updatedDb);
            return `Database updated successfully at ${updatedDb.updatedAt.date}`;
        }
        else {
            return `Database is up-to-date as of ${db.updatedAt.date}`;
        }
    }
    catch (error) {
        console.error("Error checking or updating database:", error);
        throw new Error("Failed to check or update the database");
    }
}
export default checkAndUpdateDatabase;
//# sourceMappingURL=checkAndUpdateDatabase.js.map