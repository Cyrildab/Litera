import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { UserBook, ReadingStatus } from "../entities/UserBook";
import { User } from "../entities/User";
import { MyContext } from "../types/MyContext";
import AppDataSource from "../data-source";
import { UserBookWithDetails } from "../types/UserBookWithDetails";

@Resolver()
export class UserBookResolver {
  @Mutation(() => UserBook)
  async addUserBook(
    @Arg("googleBookId") googleBookId: string,
    @Arg("status", () => ReadingStatus) status: ReadingStatus,
    @Ctx() { req }: MyContext
  ): Promise<UserBook> {
    const userId = req.user?.id;
    if (!userId) throw new Error("Non authentifié.");

    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) throw new Error("Utilisateur introuvable.");

    const existing = await AppDataSource.getRepository(UserBook).findOne({
      where: { user: { id: userId }, googleBookId },
      relations: ["user"],
    });

    if (existing) {
      existing.status = status;
      return await AppDataSource.getRepository(UserBook).save(existing);
    }

    const newUserBook = AppDataSource.getRepository(UserBook).create({
      googleBookId,
      status,
      user,
    });

    return await AppDataSource.getRepository(UserBook).save(newUserBook);
  }

  @Query(() => [UserBookWithDetails], { name: "getUserBooks" })
  async getMyBooks(@Ctx() { req }: MyContext): Promise<UserBookWithDetails[]> {
    const userId = req.user?.id;
    if (!userId) throw new Error("Non authentifié");

    const userBooks = await AppDataSource.getRepository(UserBook).find({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    return await Promise.all(
      userBooks.map(async (userBook) => {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${userBook.googleBookId}`);
        const json = await res.json();
        const volume = json.volumeInfo;

        return {
          ...userBook,
          title: volume?.title || "Titre inconnu",
          author: volume?.authors?.[0] || "Auteur inconnu",
          cover: volume?.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || "",
        };
      })
    );
  }

  @Query(() => [UserBookWithDetails])
  async getAllReviewsForBook(@Arg("googleBookId") googleBookId: string): Promise<UserBookWithDetails[]> {
    const repo = AppDataSource.getRepository(UserBook);

    const userBooks = await repo.find({
      where: { googleBookId },
      relations: ["user"],
    });

    return await Promise.all(
      userBooks.map(async (userBook) => {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${userBook.googleBookId}`);
        const json = await res.json();
        const volume = json.volumeInfo;

        return {
          ...userBook,
          title: volume?.title || "Titre inconnu",
          author: volume?.authors?.[0] || "Auteur inconnu",
          cover: volume?.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || "",
        };
      })
    );
  }

  @Mutation(() => UserBook)
  async rateUserBook(@Arg("googleBookId") googleBookId: string, @Arg("rating", () => Int) rating: number, @Ctx() { req }: MyContext): Promise<UserBook> {
    const userId = req.user?.id;
    if (!userId) throw new Error("Non authentifié");

    const repo = AppDataSource.getRepository(UserBook);
    const userBook = await repo.findOne({
      where: { user: { id: userId }, googleBookId },
      relations: ["user"],
    });

    if (!userBook) throw new Error("Livre non trouvé pour cet utilisateur");

    userBook.rating = rating;
    return await repo.save(userBook);
  }

  @Mutation(() => UserBook)
  async reviewUserBook(@Arg("googleBookId") googleBookId: string, @Arg("review") review: string, @Ctx() { req }: MyContext): Promise<UserBook> {
    const userId = req.user?.id;
    if (!userId) throw new Error("Non authentifié");

    const repo = AppDataSource.getRepository(UserBook);
    const userBook = await repo.findOne({
      where: { user: { id: userId }, googleBookId },
      relations: ["user"],
    });

    if (!userBook) throw new Error("Livre non trouvé pour cet utilisateur");

    userBook.review = review;
    return await repo.save(userBook);
  }
}
