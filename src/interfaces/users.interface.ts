import { Post } from '@interfaces/posts.interface';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
}
