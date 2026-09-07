import express from "express";
import taskRoutes from "./routes/task.routes.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import authRoutes from "./routes/auth.routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { authenticate } from "./middlewares/authenticate.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
  skip: () => process.env.NODE_ENV === "test",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts, please try again later" },
  skip: () => process.env.NODE_ENV === "test",
});

const app = express();
app.use(helmet());
app.use(generalLimiter);
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "API funcionando" });
});

app.use("/tasks", authenticate, taskRoutes);
app.use("/projects", authenticate, projectRoutes);
app.use("/users", authenticate, userRoutes);
app.use("/tags", authenticate, tagRoutes);
app.use("/auth", authLimiter, authRoutes);

app.use(errorHandler);

export default app;
