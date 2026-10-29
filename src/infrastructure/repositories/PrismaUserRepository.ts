import { IUserRepository, CreateUserData } from "../../domain/repositories/IUserRepository.js";
import { UserEntity, UserRole } from "../../domain/entities/User.js";
import { prisma } from "../database/prisma.js";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return null;
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
      user.createdAt
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
      user.createdAt
    );
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.passwordHash,
        role: data.role || "user",
      },
    });
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role as UserRole,
      user.createdAt
    );
  }
}
