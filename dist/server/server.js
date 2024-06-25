import jsonServer from "json-server";
import morgan from "morgan";
import { updateDatabase } from "../db/updateDatabase.js";
const server = jsonServer.create();
const router = jsonServer.router("src/db.json");
const middlewares = jsonServer.defaults();
server.use(morgan("combined"));
server.use(middlewares);
server.get("/check-update", async (_req, res) => {
    try {
        const message = await updateDatabase(false);
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
        const message = await updateDatabase(true);
        console.log(message);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const handleCrudUpdate = async (req, _res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
        try {
            await updateDatabase(true);
            console.log("Database updated after CRUD operation");
        }
        catch (error) {
            console.error("Error updating database after CRUD operation:", error);
        }
    }
    next();
};
server.use(handleCrudUpdate);
server.use(router);
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map