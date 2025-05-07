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
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      const user = await userRepo.findOneBy({ id: decoded.userId });

      if (user?.birthday && typeof user.birthday === "string") {
        user.birthday = new Date(user.birthday + "T00:00:00Z");
      }

      return user;
    } catch (err) {
      console.error("Erreur dans me:", err);
      return null;
    }
  }
}
