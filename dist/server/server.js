import jsonServer from "json-server";
import morgan from "morgan";
import { checkAndUpdateDatabase } from "../db/updateDatabase.js";
const server = jsonServer.create();
const router = jsonServer.router("src/db.json");
const middlewares = jsonServer.defaults();
server.use(morgan("tiny"));
server.use(middlewares);
server.get("/check-update", async (_req, res) => {
    try {
        const message = await checkAndUpdateDatabase();
        console.log(message);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
server.get("/update-database", async (_req, res) => {
    try {
        const message = await checkAndUpdateDatabase(true);
        console.log(message);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
server.use(router);
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map