import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { UserBook, ReadingStatus } from "../entities/UserBook";
import { User } from "../entities/User";
import { MyContext } from "../types/MyContext";
import AppDataSource from "../data-source";
import { UserBookWithDetails } from "../types/UserBookWithDetails";
import { logActivity } from "../utils/logActivity";
import { ActivityType } from "../entities/Activity";

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

    const repo = AppDataSource.getRepository(UserBook);

    const existing = await repo.findOne({
      where: { user: { id: userId }, googleBookId },
      relations: ["user"],
    });

    const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleBookId}`);
    const json = await res.json();
    const volume = json.volumeInfo;

    const title = volume?.title || null;
    const author = volume?.authors?.[0] || null;
    const cover = volume?.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || null;

    if (existing) {
      existing.status = status;
      existing.title = title;
      existing.author = author;
      existing.cover = cover;
      const updated = await repo.save(existing);

      await logActivity({ type: ActivityType.STATUS, user, googleBookId, title, author, cover, status });

      return updated;
    }

    const newUserBook = repo.create({ googleBookId, status, user, title, author, cover });
    const saved = await repo.save(newUserBook);

    await logActivity({ type: ActivityType.STATUS, user, googleBookId, title, author, cover, status });

    return saved;
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

    if (!userBook.title || !userBook.author || !userBook.cover) {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleBookId}`);
      const json = await res.json();
      const volume = json.volumeInfo;

      userBook.title = volume?.title || null;
      userBook.author = volume?.authors?.[0] || null;
      userBook.cover = volume?.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || null;
    }

    const saved = await repo.save(userBook);

    await logActivity({
      type: ActivityType.RATING,
      user: userBook.user,
      googleBookId,
      rating,
      title: userBook.title,
      author: userBook.author,
      cover: userBook.cover,
    });

    return saved;
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

    if (!userBook.title || !userBook.author || !userBook.cover) {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${googleBookId}`);
      const json = await res.json();
      const volume = json.volumeInfo;

      userBook.title = volume?.title || null;
      userBook.author = volume?.authors?.[0] || null;
      userBook.cover = volume?.imageLinks?.thumbnail?.replace("zoom=1", "zoom=3") || null;
    }

    const saved = await repo.save(userBook);

    await logActivity({
      type: ActivityType.REVIEW,
      user: userBook.user,
      googleBookId,
      review,
      title: userBook.title,
      author: userBook.author,
      cover: userBook.cover,
    });

    return saved;
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

  @Query(() => [UserBookWithDetails])
  async getUserBooksById(@Arg("userId", () => Int) userId: number): Promise<UserBookWithDetails[]> {
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

  @Mutation(() => Boolean)
  async deleteUserBook(@Arg("googleBookId") googleBookId: string, @Ctx() { req }: MyContext): Promise<boolean> {
    const userId = req.user?.id;
    if (!userId) throw new Error("Non authentifié");

    const repo = AppDataSource.getRepository(UserBook);
    const result = await repo.delete({ googleBookId, user: { id: userId } });
    return !!result.affected;
  }
}
