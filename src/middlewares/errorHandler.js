import { Prisma } from "../generated/prisma/client.ts";

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(500).json({ message: "Something went wrong..." });
}
