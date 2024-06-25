import jsonServer from "json-server";
import morgan from "morgan";
import { checkAndUpdateDatabase } from "../db/updateDatabase.js";

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
    const message = await checkAndUpdateDatabase();
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
    const message = await checkAndUpdateDatabase(true); // Force update
    console.log(message);
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to handle CRUD operations and update the database
const handleCrudUpdate = async (req: any, res: any, next: any) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    try {
      const message = await checkAndUpdateDatabase(true); // Force update
      console.log("Database updated after CRUD operation:", message);
    } catch (error) {
      console.error("Error updating database after CRUD operation:", error);
    }
  }
  next();
};

// Use the CRUD update middleware before the router
server.use(handleCrudUpdate);

// Use the router
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
