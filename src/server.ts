import jsonServer from "json-server";
import morgan from "morgan";
import checkAndUpdateDatabase from "./db/checkAndUpdateDatabase.js";

const server = jsonServer.create();
const router = jsonServer.router("src/db.json");
const middlewares = jsonServer.defaults();

// Setup the logger
server.use(morgan("combined"));

// Use default middlewares (logger, static, cors, and no-cache)
server.use(middlewares);

// Custom endpoint to check for updates
server.get("/check-update", async (req, res) => {
  try {
    const message = await checkAndUpdateDatabase();
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Use the router
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
