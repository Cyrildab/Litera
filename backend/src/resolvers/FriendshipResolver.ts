import { Resolver, Mutation, Arg, Ctx, Query, Int } from "type-graphql";
import { Friendship } from "../entities/Friendship";
import { User } from "../entities/User";
import AppDataSource from "../data-source";
import { MyContext } from "../types/MyContext";

@Resolver()
export class FriendshipResolver {
  @Mutation(() => Friendship)
  async sendFriendRequest(@Arg("receiverId", () => Int) receiverId: number, @Ctx() ctx: MyContext): Promise<Friendship> {
    const currentUser = ctx.req.user;

    if (!currentUser) {
      throw new Error("Non authentifié");
    }

    if (currentUser.id === receiverId) {
      throw new Error("Tu ne peux pas t'ajouter toi-même !");
    }

    const existing = await AppDataSource.getRepository(Friendship).findOne({
      where: [
        { requester: { id: currentUser.id }, receiver: { id: receiverId } },
        { requester: { id: receiverId }, receiver: { id: currentUser.id } },
      ],
    });

    if (existing) {
      throw new Error("Une relation existe déjà.");
    }

    const receiver = await AppDataSource.getRepository(User).findOneBy({ id: receiverId });
    if (!receiver) {
      throw new Error("Utilisateur introuvable");
    }

    const requester = await AppDataSource.getRepository(User).findOneBy({ id: currentUser.id });
    if (!requester) {
      throw new Error("Utilisateur émetteur introuvable");
    }

    const friendship = AppDataSource.getRepository(Friendship).create({
      requester,
      receiver,
      accepted: false,
    });

    return AppDataSource.getRepository(Friendship).save(friendship);
  }

  @Mutation(() => Friendship)
  async acceptFriendRequest(@Arg("friendshipId", () => Int) friendshipId: number, @Ctx() ctx: MyContext): Promise<Friendship> {
    const currentUser = ctx.req.user;

    if (!currentUser) {
      throw new Error("Non authentifié");
    }

    const friendshipRepo = AppDataSource.getRepository(Friendship);

    const friendship = await friendshipRepo.findOne({
      where: { id: friendshipId },
      relations: ["receiver"],
    });

    if (!friendship) {
      throw new Error("Demande non trouvée.");
    }

    if (friendship.receiver.id !== currentUser.id) {
      throw new Error("Tu n'es pas autorisé à accepter cette demande.");
    }

    if (friendship.accepted) {
      throw new Error("Cette demande est déjà acceptée.");
    }

    friendship.accepted = true;

    return friendshipRepo.save(friendship);
  }

  @Mutation(() => Boolean)
  async cancelFriendRequestOrRemoveFriend(@Arg("friendshipId", () => Int) friendshipId: number, @Ctx() ctx: MyContext): Promise<boolean> {
    const currentUser = ctx.req.user;

    if (!currentUser) {
      throw new Error("Non authentifié");
    }

    const friendshipRepo = AppDataSource.getRepository(Friendship);

    const friendship = await friendshipRepo.findOne({
      where: { id: friendshipId },
      relations: ["requester", "receiver"],
    });

    if (!friendship) {
      throw new Error("Relation introuvable.");
    }

    const isInvolved = friendship.requester.id === currentUser.id || friendship.receiver.id === currentUser.id;

    if (!isInvolved) {
      throw new Error("Tu n'es pas impliqué dans cette relation.");
    }

    await friendshipRepo.remove(friendship);
    return true;
  }

  @Query(() => [User])
  async getFriends(@Ctx() ctx: MyContext): Promise<User[]> {
    const currentUser = ctx.req.user;

    if (!currentUser) {
      throw new Error("Non authentifié");
    }

    const friendships = await AppDataSource.getRepository(Friendship).find({
      where: [
        { requester: { id: currentUser.id }, accepted: true },
        { receiver: { id: currentUser.id }, accepted: true },
      ],
      relations: ["requester", "receiver"],
    });

    return friendships.map((f) => (f.requester.id === currentUser.id ? f.receiver : f.requester));
  }

  @Query(() => [User])
  async getPendingFriendRequestsReceived(@Ctx() ctx: MyContext): Promise<User[]> {
    const currentUser = ctx.req.user;

    if (!currentUser) {
      throw new Error("Non authentifié");
    }

    const requests = await AppDataSource.getRepository(Friendship).find({
      where: { receiver: { id: currentUser.id }, accepted: false },
      relations: ["requester"],
    });

    return requests.map((f) => f.requester);
  }

  @Query(() => [User])
  async getPendingFriendRequestsSent(@Ctx() ctx: MyContext): Promise<User[]> {
    const currentUser = ctx.req.user;

    if (!currentUser) {
      throw new Error("Non authentifié");
    }

    const requests = await AppDataSource.getRepository(Friendship).find({
      where: { requester: { id: currentUser.id }, accepted: false },
      relations: ["receiver"],
    });

    return requests.map((f) => f.receiver);
  }

  @Query(() => Friendship, { nullable: true })
  async getFriendshipWithUser(@Arg("userId", () => Int) userId: number, @Ctx() ctx: MyContext): Promise<Friendship | null> {
    try {
      const currentUser = ctx.req.user;
      if (!currentUser) throw new Error("Non authentifié");

      const repo = AppDataSource.getRepository(Friendship);
      const relation = await repo.findOne({
        where: [
          { requester: { id: currentUser.id }, receiver: { id: userId } },
          { requester: { id: userId }, receiver: { id: currentUser.id } },
        ],
        relations: ["requester", "receiver"],
      });

      console.log("Relation trouvée:", relation);

      return relation || null;
    } catch (err) {
      console.error("Erreur dans getFriendshipWithUser:", err);
      throw err;
    }
  }

  @Mutation(() => Boolean)
  async removeFriend(@Arg("userId", () => Int) userId: number, @Ctx() ctx: MyContext): Promise<boolean> {
    const currentUser = ctx.req.user;
    if (!currentUser) throw new Error("Non authentifié");

    const repo = AppDataSource.getRepository(Friendship);

    const friendship = await repo.findOne({
      where: [
        { requester: { id: currentUser.id }, receiver: { id: userId }, accepted: true },
        { requester: { id: userId }, receiver: { id: currentUser.id }, accepted: true },
      ],
      relations: ["requester", "receiver"],
    });

    if (!friendship) throw new Error("Aucune amitié trouvée");

    await repo.remove(friendship);
    return true;
  }

  @Query(() => [Number])
  async getFriendIds(@Ctx() { req }: MyContext): Promise<number[]> {
    const userId = req.user?.id;
    if (!userId) throw new Error("Non authentifié");

    const friendships = await AppDataSource.getRepository(Friendship)
      .createQueryBuilder("friendship")
      .leftJoinAndSelect("friendship.requester", "requester")
      .leftJoinAndSelect("friendship.receiver", "receiver")
      .where("(friendship.requesterId = :userId OR friendship.receiverId = :userId)", { userId })
      .andWhere("friendship.accepted = true")
      .getMany();

    return friendships.map((f) => (f.requester.id === userId ? f.receiver.id : f.requester.id));
  }
}
