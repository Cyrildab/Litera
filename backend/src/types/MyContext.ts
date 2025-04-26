import { Request, Response } from "express";

export interface MyContext {
  req: Request & { user?: { id: number } };
  res: Response;
}
