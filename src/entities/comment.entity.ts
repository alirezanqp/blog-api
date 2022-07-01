import { Comment } from '@interfaces/comments.interface';
import { Post } from '@interfaces/posts.interface';
import { User } from '@interfaces/users.interface';
import { BaseEntity } from 'typeorm';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from './users.entity';

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class CommentEntity extends BaseEntity implements Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.comments)
  user: User;

  @ManyToOne(() => PostEntity, post => post.comments)
  post: Post;
}
