import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Post } from '@interfaces/posts.interface';
import { UserEntity } from '@entities/users.entity';
import { User } from '@interfaces/users.interface';
import { Comment } from '@interfaces/comments.interface';
import { CommentEntity } from '@entities/comment.entity';

@Entity()
export class PostEntity extends BaseEntity implements Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, user => user.posts)
  user: User;

  @OneToMany(() => CommentEntity, comment => comment.post)
  comments: Comment[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
