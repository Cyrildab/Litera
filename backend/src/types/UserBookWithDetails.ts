import { ObjectType, Field } from "type-graphql";
import { ReadingStatus } from "../entities/UserBook";
import { User } from "../entities/User";

@ObjectType()
export class UserBookWithDetails {
  @Field()
  id!: number;

  @Field()
  googleBookId!: string;

  @Field(() => ReadingStatus)
  status!: ReadingStatus;

  @Field(() => User)
  user!: User;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  cover?: string;

  @Field({ nullable: true })
  rating?: number;

  @Field({ nullable: true })
  review?: string;
}
