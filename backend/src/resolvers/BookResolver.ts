import { Arg, Query, Resolver } from "type-graphql";
import { Book } from "../entities/Book";
import AppDataSource from "../data-source";

@Resolver()
export class BookResolver {
  @Query(() => Book)
  async book(@Arg("id") id: number) {
    const book = await AppDataSource.getRepository(Book).findOneBy({ id });
    return book;
  }

  @Query(() => [Book])
  async books() {
    return AppDataSource.getRepository(Book).find();
  }
}
