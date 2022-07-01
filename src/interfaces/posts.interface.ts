import { Comment } from '@interfaces/comments.interface';
import { User } from '@interfaces/users.interface';

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments: Comment[];
}
