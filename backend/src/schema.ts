import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { BookResolver } from "./resolvers/BookResolver";

export const createSchema = () => {
  return buildSchema({
    resolvers: [BookResolver],
  });
};
