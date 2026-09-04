import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../services/project.service.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../schemas/project.schema.js";

export async function getProjects(req, res) {
  const userId = req.user.id;
  const projects = await getAllProjects(userId);
  return res.status(200).json(projects);
}

export async function getProjectByIdHandler(req, res) {
  const id = Number(req.params.id);
  const userId = req.user.id;
  const project = await getProjectById(id, userId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.status(200).json(project);
}

export async function createProjectHandler(req, res, next) {
  try {
    const result = createProjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const userId = req.user.id;
    const project = await createProject(result.data, userId);
    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

export async function updateProjectHandler(req, res, next) {
  try {
    const result = updateProjectSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.issues);
    }

    const id = Number(req.params.id);
    const userId = req.user.id;
    const project = await updateProject(id, result.data, userId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const result = await deleteProject(id, userId);

    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
