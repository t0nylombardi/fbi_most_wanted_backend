import express from "express";
import morgan from "morgan";
import apiRouter from "./api/apiRouter.js";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(morgan("combined"));
app.use("/api/v1", apiRouter);
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map