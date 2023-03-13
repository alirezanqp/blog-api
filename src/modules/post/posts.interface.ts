import { Comment } from '@interfaces/comments.interface';
import { User } from '@/modules/user/users.interface';

export interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
}
