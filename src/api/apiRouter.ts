import express, { Request, Response, NextFunction } from "express";
import { updateDatabase } from "../db/updateDatabase.js";
import { readDatabase, writeDatabase } from "../db/database.js";
import { fetchDefaultAllPages } from "../api/defaultAllPages.js";
import { CATEGORIES } from "../constants/categories.js";
import { v4 as uuidv4 } from "uuid";

const apiRouter = express.Router();

// Add a simple test endpoint
apiRouter.get("/test", (req: Request, res: Response) => {
  res.send({ message: "Server is working xxxxx" });
});

apiRouter.get("/default-all-pages", async (req: Request, res: Response) => {
  try {
    const db = await fetchDefaultAllPages();
    res.json(db || []);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

apiRouter.get("/update-database", async (req: Request, res: Response) => {
  try {
    const message = await updateDatabase(true); // Force update
    res.status(200).send({ message });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

apiRouter.get("/up", (req, res) => {
  res.send({ message: "up" });
});

// CRUD operations for various categories
apiRouter.get("/:category", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    res.json(db[req.params.category]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

apiRouter.post("/:category", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const newItem = { ...req.body, id: uuidv4() };
    db[req.params.category].push(newItem);
    await writeDatabase(db);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

apiRouter.get("/:category/:id", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const items = db[req.params.category];
    const id = req.params.id;
    const item = items.find((item: { id: number }) => item.id === parseInt(id));
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

apiRouter.delete("/:category/:id", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const items = db[req.params.category];
    const index = items.findIndex(
      (item: { id: string }) => item.id === req.params.id
    );
    if (index === -1) return res.status(404).json({ error: "Not found" });
    items.splice(index, 1);
    await writeDatabase(db);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to check for updates
apiRouter.get("/check-update", async (req: Request, res: Response) => {
  try {
    const message = await updateDatabase();
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to force update

export default apiRouter;
