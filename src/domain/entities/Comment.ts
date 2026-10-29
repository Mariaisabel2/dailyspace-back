export class CommentEntity {
  constructor(
    public readonly id: number,
    public readonly content: string,
    public readonly userId: number,
    public readonly postId: number,
    public readonly createdAt: Date,
    public readonly userName?: string,
    public readonly postTitle?: string
  ) {}
}
