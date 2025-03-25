import { Arg, Query, Resolver } from "type-graphql";
import { Book } from "../entities/Book";
import AppDataSource from "../data-source";

@Resolver()
export class BookSearchResolver {
  @Query(() => [Book])
  async searchBooks(@Arg("query") query: string): Promise<Book[]> {
    return AppDataSource.getRepository(Book)
      .createQueryBuilder("book")
      .where("LOWER(book.title) LIKE LOWER(:query)", { query: `%${query}%` })
      .getMany();
  }
}
