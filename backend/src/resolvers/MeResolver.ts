import { Ctx, Query, Resolver } from "type-graphql";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import AppDataSource from "../data-source";

const userRepo = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: any): Promise<User | null> {
    const token = context.req.cookies.token;
    if (!token) return null;

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      return await userRepo.findOneBy({ id: decoded.userId });
    } catch (err) {
      return null;
    }
  }
}
