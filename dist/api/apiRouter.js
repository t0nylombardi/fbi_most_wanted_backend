import express from "express";
import { updateDatabase } from "../db/updateDatabase.js";
import { readDatabase, writeDatabase } from "../db/database.js";
import { v4 as uuidv4 } from "uuid";
const apiRouter = express.Router();
apiRouter.get("/:category", async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db[req.params.category]);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
apiRouter.post("/:category", async (req, res) => {
    try {
        const db = await readDatabase();
        const newItem = { ...req.body, id: uuidv4() };
        db[req.params.category].push(newItem);
        await writeDatabase(db);
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
apiRouter.put("/:category/:id", async (req, res) => {
    try {
        const db = await readDatabase();
        const items = db[req.params.category];
        const index = items.findIndex((item) => item.id === req.params.id);
        if (index === -1)
            return res.status(404).json({ error: "Not found" });
        const updatedItem = { ...req.body, id: req.params.id };
        items[index] = updatedItem;
        await writeDatabase(db);
        res.json(updatedItem);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
apiRouter.delete("/:category/:id", async (req, res) => {
    try {
        const db = await readDatabase();
        const items = db[req.params.category];
        const index = items.findIndex((item) => item.id === req.params.id);
        if (index === -1)
            return res.status(404).json({ error: "Not found" });
        items.splice(index, 1);
        await writeDatabase(db);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
apiRouter.get("/check-update", async (req, res) => {
    try {
        const message = await updateDatabase();
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
apiRouter.get("/update-database", async (req, res) => {
    try {
        const message = await updateDatabase(true);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
export default apiRouter;
//# sourceMappingURL=apiRouter.js.map