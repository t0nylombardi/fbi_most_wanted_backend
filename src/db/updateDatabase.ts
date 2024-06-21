import { readDatabase, writeDatabase } from "./database.js";
import { fetchWantedList } from "../api/fbiApi.js";
import { fetchCaseOfTheWeek } from "../api/caseOfTheWeek.js";
import { CATEGORIES } from "../constants/categories.js";
import { v4 as uuidv4 } from "uuid";
import { isDatabaseOutdated } from "../utils/dateUtils.js";

/**
 * Fetches data for a specific category.
 * @param category - The category to fetch data for.
 * @param poster_classification - The poster classification for the category.
 * @returns The fetched data with unique IDs added.
 */
async function updateCategoryData(
  category: string,
  poster_classification: string
): Promise<any[]> {
  try {
    const data = await fetchWantedList({
      pageSize: 20,
      page: 1,
      sort_on: "modified",
      sort_order: "desc",
      poster_classification,
      status: "na",
    });

    return data.items.map((item: any) => ({
      ...item,
      id: uuidv4(),
    }));
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    return [];
  }
}

/**
 * Updates all categories with the latest data.
 * @returns An object containing updated data for all categories.
 */
async function updateAllCategories(): Promise<Record<string, any[]>> {
  const updatedData: Record<string, any[]> = {};

  for (const [category, poster_classification] of Object.entries(CATEGORIES)) {
    console.log(`Fetching data for category: ${category}`);
    updatedData[category] = await updateCategoryData(
      category,
      poster_classification
    );
  }

  return updatedData;
}

/**
 * Updates the case of the week in the database as a single element in an array.
 * @param db - The current database state.
 * @returns The updated database state with the case of the week included as an array.
 */
async function updateCaseOfTheWeek(db: any): Promise<any> {
  console.log("Fetching Case of the Week...");
  const caseOfTheWeek = await fetchCaseOfTheWeek();
  if (caseOfTheWeek) {
    db.case_of_the_week = [caseOfTheWeek];
  } else {
    console.log("Case of the Week not found");
    db.case_of_the_week = [];
  }
  return db;
}

/**
 * Checks if the database is outdated and updates it if necessary.
 * @param forceUpdate - Whether to force update the database regardless of the last update time.
 * @returns A message indicating whether the database was updated or is up-to-date.
 */
export async function checkAndUpdateDatabase(
  forceUpdate: boolean = false
): Promise<string> {
  let db;
  try {
    db = await readDatabase();
  } catch (error) {
    console.error("Error reading database:", error);
    throw new Error("Failed to read the database");
  }

  // check to see if updatedAt is null, if so, set it to new Date and update the database, else check if the database is outdated
  if (
    !db.updatedAt ||
    forceUpdate ||
    isDatabaseOutdated(new Date(db.updatedAt.date))
  ) {
    console.log("Database update requested or outdated. Fetching new data...");
    console.log("Database update requested or outdated. Fetching new data...");

    let updatedDb = { ...db, updatedAt: { date: new Date().toISOString() } };
    try {
      const categoriesData = await updateAllCategories();
      updatedDb = { ...updatedDb, ...categoriesData };
    } catch (error) {
      console.error("Error updating categories:", error);
      throw new Error("Failed to update categories");
    }

    try {
      updatedDb = await updateCaseOfTheWeek(updatedDb);
    } catch (error) {
      console.error("Error updating Case of the Week:", error);
      throw new Error("Failed to update Case of the Week");
    }

    try {
      await writeDatabase(updatedDb);
      console.log("Database updated successfully");
      return "Database updated successfully";
    } catch (error) {
      console.error("Error writing database:", error);
      throw new Error("Failed to write the database");
    }
  } else {
    console.log("Database is up-to-date");
    return "Database is up-to-date";
  }
}
