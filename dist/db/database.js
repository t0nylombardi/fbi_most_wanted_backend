import fs from "fs/promises";
import path from "path";
const DB_PATH = path.resolve("src/db.json");
export async function readDatabase() {
    const content = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(content);
}
export async function writeDatabase(db) {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}
//# sourceMappingURL=database.js.map