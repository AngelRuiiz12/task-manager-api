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
  const projects = await getAllProjects();
  return res.status(200).json(projects);
}

export async function getProjectByIdHandler(req, res) {
  const id = Number(req.params.id);
  const project = await getProjectById(id);

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

    const project = await createProject(result.data);
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
    const project = await updateProject(id, result.data);

    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
}

export async function deleteProjectHandler(req, res, next) {
  try {
    const id = Number(req.params.id);
    await deleteProject(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
