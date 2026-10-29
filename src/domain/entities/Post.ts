export type PostVisibility = "Público" | "Privado";

export class PostEntity {
  constructor(
    public readonly id: number,
    public readonly author: string,
    public readonly title: string,
    public readonly media: string,
    public readonly content: string,
    public readonly visibility: PostVisibility,
    public readonly likes: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
