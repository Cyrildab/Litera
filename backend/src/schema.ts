import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver";
import { BookSearchResolver } from "./resolvers/SearchBooks";
import { RegisterResolver } from "./resolvers/RegisterResolver";
import { LoginResolver } from "./resolvers/LoginResolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [BookResolver, BookSearchResolver, RegisterResolver, LoginResolver],
  });
