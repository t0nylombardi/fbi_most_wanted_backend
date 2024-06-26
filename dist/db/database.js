import { promises as fs } from "fs";
import path from "path";
const dbPath = path.resolve("src/db.json");
export async function readDatabase() {
    const data = await fs.readFile(dbPath, "utf8");
    return JSON.parse(data);
}
export async function writeDatabase(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}
//# sourceMappingURL=database.js.map