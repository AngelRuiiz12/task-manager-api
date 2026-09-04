import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function generateToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export async function register(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { email: data.email, name: data.name, password: hashedPassword },
  });

  const token = generateToken(user);

  return { user, token };
}

export async function login(data) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    omit: { password: false },
  });

  if (!user) {
    throw new InvalidCredentialsError("Invalid credentials");
  }

  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new InvalidCredentialsError("Invalid credentials");
  }

  const token = generateToken(user);
  const { password, ...safeUser } = user; // esto es para quitar la password del objeto user

  return { user: safeUser, token };
}

export class InvalidCredentialsError extends Error {}
