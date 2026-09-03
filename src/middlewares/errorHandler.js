import { Prisma } from "../generated/prisma/client.ts";

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        return res.status(404).json({ message: "Resource not found" });
      case "P2002":
        return res.status(409).json({ message: "Resource already exists" });
    }
  }

  return res.status(500).json({ message: "Something went wrong..." });
}
