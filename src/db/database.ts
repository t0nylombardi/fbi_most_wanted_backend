import { promises as fs } from "fs";
import path from "path";

const dbPath = path.resolve("src/db.json");

export async function readDatabase(): Promise<any> {
  const data = await fs.readFile(dbPath, "utf8");
  return JSON.parse(data);
}

export async function writeDatabase(data: any): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
