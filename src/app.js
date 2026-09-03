import express from "express";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "API funcionando" });
});

app.use("/tasks", taskRoutes);
app.use("/projects", projectRoutes);

app.use(errorHandler);

export default app;
