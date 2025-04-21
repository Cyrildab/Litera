import { Arg, Ctx, Mutation, ObjectType, Resolver, Field } from "type-graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "../entities/User";
import AppDataSource from "../data-source";

const userRepo = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

@ObjectType()
class AuthPayload {
  @Field(() => User)
  user!: User;
}

@Resolver()
export class LoginResolver {
  @Mutation(() => AuthPayload)
  async login(@Arg("email") email: string, @Arg("password") password: string, @Ctx() context: { res: Response }): Promise<AuthPayload> {
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error("Email ou mot de passe incorrect");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Email ou mot de passe incorrect");

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    context.res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { user };
  }
}
