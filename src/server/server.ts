import jsonServer from "json-server";
import morgan from "morgan";
import { readDatabase } from "../db/database.js";
import { checkAndUpdateDatabase } from "../db/updateLogic.js";

const server = jsonServer.create();
const router = jsonServer.router("src/db.json");
const middlewares = jsonServer.defaults();

// Setup the logger
server.use(morgan("combined"));

// Use default middlewares (logger, static, cors, and no-cache)
server.use(middlewares);

// Endpoint to check for updates
server.get("/check-update", async (_req, res) => {
  try {
    const db = await readDatabase();
    const message = await checkAndUpdateDatabase(db);
    console.log(message);
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update database anytime
server.get("/update-database", async (_req, res) => {
  try {
    const db = await readDatabase();
    const message = await checkAndUpdateDatabase(db, true); // Force update
    console.log(message);
    res.status(200).json({ message: "Database updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Use the router
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
