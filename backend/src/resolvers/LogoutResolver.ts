import { Ctx, Mutation, Resolver } from "type-graphql";
import { Response } from "express";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() context: { res: Response }): Promise<boolean> {
    context.res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return true;
  }
}
