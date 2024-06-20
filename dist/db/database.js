import { promises as fs } from "fs";
import path from "path";
const dbPath = path.resolve("src/db.json");
export async function readDatabase() {
    const dbContent = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(dbContent);
}
export async function writeDatabase(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
//# sourceMappingURL=database.js.map