import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { RegisterResolver } from "./resolvers/RegisterResolver";
import { LoginResolver } from "./resolvers/LoginResolver";
import { MeResolver } from "./resolvers/MeResolver";
import { LogoutResolver } from "./resolvers/LogoutResolver";
import { GoogleBooksResolver } from "./resolvers/GoogleBooksResolver";
import { UserBookResolver } from "./resolvers/UserBookResolver";

export const createSchema = () =>
  buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, LogoutResolver, GoogleBooksResolver, UserBookResolver],
  });
