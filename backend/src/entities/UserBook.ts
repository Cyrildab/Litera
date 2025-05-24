import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

export enum ReadingStatus {
  TO_READ = "TO_READ",
  IN_PROGRESS = "IN_PROGRESS",
  ABANDONED = "ABANDONED",
  READ = "READ",
}

registerEnumType(ReadingStatus, {
  name: "ReadingStatus",
});

@ObjectType()
@Entity()
export class UserBook extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  googleBookId!: string;

  @Field(() => ReadingStatus)
  @Column({ type: "enum", enum: ReadingStatus })
  status!: ReadingStatus;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.userBooks)
  user!: User;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  author?: string;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  cover?: string;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  rating?: number;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  review?: string;
}
