import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Activity, ActivityType } from "../entities/Activity";
import { MyContext } from "../types/MyContext";
import AppDataSource from "../data-source";
import { User } from "../entities/User";

@Resolver()
export class ActivityResolver {
  @Query(() => [Activity])
  async getRecentActivities(@Arg("userIds", () => [Int], { nullable: true }) userIds?: number[]): Promise<Activity[]> {
    const query = AppDataSource.getRepository(Activity)
      .createQueryBuilder("activity")
      .leftJoinAndSelect("activity.user", "user")
      .orderBy("activity.createdAt", "DESC")
      .limit(50);

    if (userIds?.length) {
      query.where("activity.userId IN (:...userIds)", { userIds });
    }

    return await query.getMany();
  }

  @Mutation(() => Activity)
  async logActivity(
    @Arg("type", () => ActivityType) type: ActivityType,
    @Arg("googleBookId") googleBookId: string,
    @Arg("title", { nullable: true }) title: string,
    @Arg("author", { nullable: true }) author: string,
    @Arg("cover", { nullable: true }) cover: string,
    @Arg("status", { nullable: true }) status: string,
    @Arg("rating", () => Number, { nullable: true }) rating: number,
    @Arg("review", { nullable: true }) review: string,
    @Ctx() { req }: MyContext
  ): Promise<Activity> {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: req.user?.id });
    if (!user) throw new Error("Utilisateur non authentifié");

    const activity = AppDataSource.getRepository(Activity).create({
      type,
      user,
      googleBookId,
      title,
      author,
      cover,
      status,
      rating,
      review,
    });

    return await AppDataSource.getRepository(Activity).save(activity);
  }
}
