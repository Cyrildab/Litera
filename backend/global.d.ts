import { Session, SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

declare module "express" {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}
