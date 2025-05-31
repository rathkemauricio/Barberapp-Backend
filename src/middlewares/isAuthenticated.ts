import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    res.status(401).json({ errorCode: "token.invalid" });
    return;
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload;
    req.user_id = sub;
    next();
  } catch (err) {
    res.status(401).json({ errorCode: "token.expired" });
    return;
  }
}