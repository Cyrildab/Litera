import { Field, ObjectType, ID } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserBook } from "./UserBook";
import { Friendship } from "./Friendship";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 20, unique: true })
  username!: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  description?: string;

  @Field()
  @Column({ length: 50, unique: true })
  email!: string;

  @Column({ length: 100 })
  password!: string;

  @Field({ nullable: true })
  @Column({ length: 1000, nullable: true })
  image?: string;

  @Field({ nullable: true })
  @Column({ type: "date", nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  @Column({ type: "boolean", nullable: true })
  gender?: boolean;

  @OneToMany(() => UserBook, (userBook) => userBook.user)
  userBooks?: UserBook[];

  @OneToMany(() => Friendship, (friendship) => friendship.requester)
  sentFriendRequests!: Friendship[];

  @OneToMany(() => Friendship, (friendship) => friendship.receiver)
  receivedFriendRequests!: Friendship[];
}
