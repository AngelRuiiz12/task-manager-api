import express from "express";
import taskRoutes from "./routes/task.routes.js";

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "API funcionando" });
});

export default app;
