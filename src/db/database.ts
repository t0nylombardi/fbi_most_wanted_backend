import { promises as fs } from "fs";
import path from "path";

interface Database {
  ten_most_wanted: any[];
  fugitives: any[];
  capitol_violence: any[];
  terrorism: any[];
  kidnappings_missing_persons: any[];
  parental_kidnappings: any[];
  seeking_info: any[];
  case_of_the_week?: any;
  updatedAt: string;
}

const dbPath = path.resolve("src/db.json");

export async function readDatabase(): Promise<Database> {
  const dbContent = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(dbContent) as Database;
}

export async function writeDatabase(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
