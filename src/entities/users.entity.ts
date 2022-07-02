import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { Post } from '@interfaces/posts.interface';
import { PostEntity } from '@entities/post.entity';
import { Comment } from '@interfaces/comments.interface';
import { CommentEntity } from '@entities/comment.entity';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  @Unique(['username'])
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => PostEntity, post => post.user)
  posts: Post[];

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: Comment[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
