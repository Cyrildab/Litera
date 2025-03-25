import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver";
import { BookSearchResolver } from "./resolvers/SearchBooks";

export const createSchema = () =>
  buildSchema({
    resolvers: [BookResolver, BookSearchResolver],
  });
