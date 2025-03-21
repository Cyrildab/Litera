import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id?: number;

  @Column({ length: 250 })
  @Field()
  title: string;

  @Column({ length: 255 })
  @Field()
  author: string;

  @Column({ length: 100 })
  @Field()
  gender: string;

  @Column("text", { nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ length: 255 })
  @Field()
  cover: string;

  constructor(title: string, author: string, gender: string, cover: string, description?: string) {
    super();
    this.title = title;
    this.author = author;
    this.gender = gender;
    this.cover = cover;
    this.description = description;
  }
}
