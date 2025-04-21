import { Arg, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import AppDataSource from "../data-source";

const userRepo = AppDataSource.getRepository(User);

@Resolver()
export class RegisterResolver {
  @Mutation(() => Boolean)
  async register(@Arg("username") username: string, @Arg("email") email: string, @Arg("password") password: string): Promise<boolean> {
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) throw new Error("Email déjà utilisé");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({ username, email, password: hashedPassword });
    await userRepo.save(user);

    return true;
  }
}
