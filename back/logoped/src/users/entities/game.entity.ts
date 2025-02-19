// game.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  score: number;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.games)
  user: User;
}
