import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { User } from "./User";

export enum ActivityType {
  STATUS = "STATUS",
  RATING = "RATING",
  REVIEW = "REVIEW",
}

registerEnumType(ActivityType, {
  name: "ActivityType",
});

@ObjectType()
@Entity()
export class Activity extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => ActivityType)
  @Column({ type: "enum", enum: ActivityType })
  type!: ActivityType;

  @Field()
  @Column()
  googleBookId!: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user!: User;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cover?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  @Column({ type: "enum", enum: ["TO_READ", "IN_PROGRESS", "ABANDONED", "READ"], nullable: true })
  status?: string;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  rating?: number;

  @Field({ nullable: true })
  @Column({ type: "text", nullable: true })
  review?: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
