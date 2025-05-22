import { Activity, ActivityType } from "../entities/Activity";
import { User } from "../entities/User";
import AppDataSource from "../data-source";
import { MoreThan } from "typeorm";

export async function logActivity(params: {
  type: ActivityType;
  user: User;
  googleBookId: string;
  title?: string;
  author?: string;
  cover?: string;
  status?: string;
  rating?: number;
  review?: string;
}) {
  const repo = AppDataSource.getRepository(Activity);

  const recentActivity = await repo.findOne({
    where: {
      user: { id: params.user.id },
      googleBookId: params.googleBookId,
      createdAt: MoreThan(new Date(Date.now() - 100000)),
    },
    order: { createdAt: "DESC" },
  });

  if (recentActivity) {
    if (params.status) recentActivity.status = params.status;
    if (params.rating !== undefined) recentActivity.rating = params.rating;
    if (params.review) recentActivity.review = params.review;
    recentActivity.type = ActivityType.REVIEW;
    await repo.save(recentActivity);
    return;
  }

  const activity = repo.create({ ...params });
  await repo.save(activity);
}
