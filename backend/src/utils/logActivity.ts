import { Activity, ActivityType } from "../entities/Activity";
import { User } from "../entities/User";
import AppDataSource from "../data-source";

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
  const activity = AppDataSource.getRepository(Activity).create({
    ...params,
  });

  await AppDataSource.getRepository(Activity).save(activity);
}
