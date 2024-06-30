import { readDatabase, writeDatabase } from "./database.js";
import { fetchWantedList } from "../api/fbiApi.js";
import { fetchCaseOfTheWeek } from "../api/caseOfTheWeek.js";
import { fetchDefaultAllPages } from "../api/defaultAllPages.js";
import { CATEGORIES } from "../constants/categories.js";
import { v4 as uuidv4 } from "uuid";
import { isDatabaseOutdated } from "../utils/dateUtils.js";

/**
 * Checks if the database should be updated based on the last update time.
 * @param db - The current database state.
 * @param forceUpdate - Whether to force update the database.
 * @returns True if the database should be updated, false otherwise.
 */
async function shouldUpdateDatabase(
  db: any,
  forceUpdate: boolean
): Promise<boolean> {
  if (
    forceUpdate ||
    !db.updatedAt ||
    isDatabaseOutdated(new Date(db.updatedAt.date))
  ) {
    return true;
  }
  return false;
}

/**
 * Performs the database update.
 * @param db - The current database state.
 * @returns A message indicating whether the update was successful.
 */
async function performDatabaseUpdate(db: any): Promise<string> {
  let updatedDb = { ...db, updatedAt: { date: new Date().toISOString() } };

  try {
    const categoriesData = await updateAllCategories();
    updatedDb = { ...updatedDb, ...categoriesData };
  } catch (error) {
    console.error("Error updating categories:", error);
    throw new Error("Failed to update categories");
  }

  try {
    updatedDb = await updateDefaultAllPages(updatedDb);
  } catch (error) {
    console.error("Error updating default all pages:", error);
    throw new Error("Failed to update default all pages");
  }

  try {
    await writeDatabase(updatedDb);
    console.log("Database updated successfully");
    return "Database updated successfully";
  } catch (error) {
    console.error("Error writing database:", error);
    throw new Error("Failed to write the database");
  }
}

/**
 * Updates data for a specific category.
 * @param category - The category to update.
 * @param poster_classification - The poster classification for the category.
 * @returns The updated data for the category.
 */
async function updateCategoryData(
  category: string,
  poster_classification: string
): Promise<any[]> {
  try {
    const data = await fetchWantedList({
      pageSize: 1000,
      page: 1,
      sort_on: "modified",
      sort_order: "desc",
      poster_classification,
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

async function updateDefaultAllPages(db: any): Promise<any> {
  const allPages = await fetchDefaultAllPages();
  if (!allPages) {
    console.error("Failed to fetch default");
    db.default_all_pages = [];
  } else {
    console.log("Fetched all pages");
    db.default_all_pages = allPages;
  }
  return db;
}

/**
 * Checks if the database is outdated and updates it if necessary.
 * @param forceUpdate - Whether to force update the database.
 * @returns A message indicating whether the database was updated or is up-to-date.
 */
export async function updateDatabase(
  forceUpdate: boolean = false
): Promise<string> {
  let db;
  try {
    db = await readDatabase();
  } catch (error) {
    console.error("Error reading database:", error);
    throw new Error("Failed to read the database");
  }

  const updateNeeded = await shouldUpdateDatabase(db, forceUpdate);
  if (updateNeeded) {
    console.log("Database update requested or outdated. Fetching new data...");
    try {
      const message = await performDatabaseUpdate(db);
      return message;
    } catch (error) {
      console.error("Error performing database update:", error);
      throw new Error("Failed to update the database");
    }
  } else {
    console.log("Database is up-to-date");
    return "Database is up-to-date";
  }
}
