import fs from "fs/promises";
import path from "path";

const DB_PATH = path.resolve("src/db.json");

/**
 * Reads the database from the file system.
 * @returns The database content.
 */
export async function readDatabase(): Promise<any> {
  const content = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(content);
}

/**
 * Writes the database to the file system.
 * @param db - The database content.
 */
export async function writeDatabase(db: any): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
