import express, { Request, Response, NextFunction } from "express";
import { updateDatabase } from "../db/updateDatabase.js";
import { readDatabase, writeDatabase } from "../db/database.js";
import { v4 as uuidv4 } from "uuid";

const apiRouter = express.Router();

// Endpoint to check for updates
apiRouter.get("/check-update", async (req: Request, res: Response) => {
  try {
    const message = await updateDatabase();
    res.status(200).json({ message });
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

// CRUD operations for various categories

// Create a new item in a category
apiRouter.post("/:category", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const newItem = { ...req.body, id: uuidv4() };
    if (!db[req.params.category]) {
      db[req.params.category] = [];
    }
    db[req.params.category].push(newItem);
    await writeDatabase(db);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Read all items from a category
apiRouter.get("/:category", async (req: Request, res: Response) => {
  console.log("req.params", req.params);
  try {
    const db = await readDatabase();
    if (!db[req.params.category]) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(db[req.params.category]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Read an item from a category
apiRouter.get("/:category/:id", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const items = db[req.params.category];
    if (!items) return res.status(404).json({ error: "Category not found" });
    const id = req.params.id;
    const item = items.find((item: { id: string }) => item.id === id);
    if (!item) return res.status(404).json({ error: "ID Not found" });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an item in a category
apiRouter.put("/:category/:id", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const items = db[req.params.category];
    if (!items) return res.status(404).json({ error: "Category not found" });

    const index = items.findIndex(
      (item: { id: string }) => item.id === req.params.id
    );

    if (index === -1) return res.status(404).json({ error: "ID Not found" });

    items[index] = { ...items[index], ...req.body };
    await writeDatabase(db);
    res.status(200).json(items[index]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an item in a category
apiRouter.delete("/:category/:id", async (req: Request, res: Response) => {
  try {
    const db = await readDatabase();
    const items = db[req.params.category];
    if (!items) return res.status(404).json({ error: "Category not found" });
    const index = items.findIndex(
      (item: { id: string }) => item.id === req.params.id
    );
    if (index === -1) return res.status(404).json({ error: "ID not found" });
    items.splice(index, 1);
    await writeDatabase(db);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login endpoint
apiRouter.post("/user/auth", async (req: Request, res: Response) => {
  console.log("req.body", req.body);
  try {
    const db = await readDatabase();
    const { username, password } = req.body;
    console.log("db.users", db.users);
    const user = db.users.find(
      (user: { username: string; password: string }) =>
        user.username === username.toLowerCase() &&
        user.password === password.toLowerCase()
    );
    if (!user)
      return res.status(401).json({
        error: "Invalid credentials",
        username: username,
        password: password,
      });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler for /api/v1/ routes
apiRouter.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not Found in API" });
});

export default apiRouter;
