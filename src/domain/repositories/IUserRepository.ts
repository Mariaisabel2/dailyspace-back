import { UserEntity } from "../entities/User.js";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: "admin" | "user";
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
}
