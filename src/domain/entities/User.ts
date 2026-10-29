export type UserRole = "admin" | "user";

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly createdAt: Date
  ) {}

  public toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
