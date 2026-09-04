import express from "express";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { authenticate } from "./middlewares/authenticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "API funcionando" });
});

app.use("/tasks", authenticate, taskRoutes);
app.use("/projects", authenticate, projectRoutes);
app.use("/users", authenticate, userRoutes);
app.use("/tags", authenticate, tagRoutes);
app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;
