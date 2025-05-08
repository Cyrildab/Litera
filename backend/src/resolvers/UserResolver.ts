import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../types/MyContext";
import { UpdateUserInput } from "../inputs/UpdateUserInput";
import AppDataSource from "../data-source";

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async updateUser(@Arg("data") data: UpdateUserInput, @Ctx() { req }: MyContext): Promise<User> {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, data);
    const savedUser = await userRepo.save(user);

    const userToReturn = { ...savedUser } as any;
    if (userToReturn.birthday && typeof userToReturn.birthday === "string") {
      userToReturn.birthday = new Date(userToReturn.birthday + "T00:00:00Z");
    }

    return userToReturn;
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Arg("userId", () => Int) userId: number): Promise<User | null> {
    return await AppDataSource.getRepository(User).findOneBy({ id: userId });
  }
}
