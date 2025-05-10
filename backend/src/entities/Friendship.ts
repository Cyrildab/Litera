import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Friendship {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.sentFriendRequests, { onDelete: "CASCADE" })
  requester!: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.receivedFriendRequests, { onDelete: "CASCADE" })
  receiver!: User;

  @Field()
  @Column({ default: false })
  accepted!: boolean;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
