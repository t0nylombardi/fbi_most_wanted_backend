import fetch from "node-fetch";
import { promises as fs } from "fs";
import path from "path";

const BASE_FBI_URI = "https://api.fbi.gov/@wanted";

type WantedListParams = {
  pageSize: number;
  page: number;
  sort_on: string;
  sort_order: string;
  poster_classification: string;
};

type Category =
  | "ten_most_wanted"
  | "fugitives"
  | "capitol_violence"
  | "terrorism"
  | "kidnappings_missing_persons"
  | "parental_kidnappings"
  | "seeking_info";

interface Database {
  ten_most_wanted: any[];
  fugitives: any[];
  capitol_violence: any[];
  terrorism: any[];
  kidnappings_missing_persons: any[];
  parental_kidnappings: any[];
  seeking_info: any[];
  updatedAt: {
    date: string;
  };
}

const CATEGORIES: Record<Category, string> = {
  ten_most_wanted: "ten",
  fugitives: "fugitive",
  capitol_violence: "capitol_violence",
  terrorism: "terrorism",
  kidnappings_missing_persons: "kidnapping_missing",
  parental_kidnappings: "parental_kidnapping",
  seeking_info: "seeking_info",
};

/**
 * Fetches the wanted list from the FBI API based on the provided parameters.
 * @param params - The parameters for fetching the wanted list.
 * @returns The fetched data as JSON.
 * @throws Error if the fetch operation fails.
 */
async function fetchWantedList(params: WantedListParams): Promise<any> {
  const { pageSize, page, sort_on, sort_order, poster_classification } = params;
  const url = `${BASE_FBI_URI}?pageSize=${pageSize}&page=${page}&sort_on=${sort_on}&sort_order=${sort_order}&poster_classification=${poster_classification}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Reads the database content from the specified file path.
 * @param filePath - The path to the database file.
 * @returns The parsed database content.
 * @throws Error if the file read or JSON parse operation fails.
 */
async function readDatabase(filePath: string): Promise<Database> {
  const dbContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(dbContent) as Database;
}

/**
 * Writes the updated database content to the specified file path.
 * @param filePath - The path to the database file.
 * @param data - The data to be written to the file.
 * @throws Error if the file write operation fails.
 */
async function writeDatabase(filePath: string, data: Database): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * Checks if the database is outdated and updates it if necessary.
 * @returns A message indicating whether the database was updated or is up-to-date.
 */
async function checkAndUpdateDatabase(): Promise<string> {
  const dbPath = path.resolve("src/db.json");

  try {
    const db = await readDatabase(dbPath);
    const updatedAt = new Date(db.updatedAt.date);
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (now.getTime() - updatedAt.getTime() > oneDayInMs) {
      const updatedDb: Database = {
        ...db,
        updatedAt: { date: new Date().toISOString() },
      };

      for (const [category, poster_classification] of Object.entries(
        CATEGORIES
      )) {
        try {
          const data = await fetchWantedList({
            pageSize: 20,
            page: 1,
            sort_on: "modified",
            sort_order: "desc",
            poster_classification,
          });
          updatedDb[category as Category] = data.items;
        } catch (error) {
          console.error(`Error fetching ${category}:`, error);
        }
      }

      await writeDatabase(dbPath, updatedDb);
      return "Database updated successfully";
    } else {
      return "Database is up-to-date";
    }
  } catch (error) {
    console.error("Error checking or updating database:", error);
    throw new Error("Failed to check or update the database");
  }
}

export default checkAndUpdateDatabase;
