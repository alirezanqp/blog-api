import { Post } from '@interfaces/posts.interface';
import { User } from '@interfaces/users.interface';

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  post: Post;
}
