import { Post } from '@interfaces/posts.interface';

export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
}
