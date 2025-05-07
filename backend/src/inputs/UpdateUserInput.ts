import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  gender?: boolean;
}
