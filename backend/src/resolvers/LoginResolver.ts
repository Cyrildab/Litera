import { Arg, Mutation, ObjectType, Resolver, Field } from "type-graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import AppDataSource from "../data-source";

const userRepo = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

@ObjectType()
class AuthPayload {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}

@Resolver()
export class LoginResolver {
  @Mutation(() => AuthPayload)
  async login(@Arg("email") email: string, @Arg("password") password: string): Promise<AuthPayload> {
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, user };
  }
}
