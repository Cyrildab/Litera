import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class GoogleBookResult {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  author!: string;

  @Field()
  cover!: string;

  @Field()
  gender!: string;

  @Field()
  description!: string;
}
