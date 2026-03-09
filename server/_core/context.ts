import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { COOKIE_NAME } from "@shared/const";
import { verifySessionToken } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const sessionToken = opts.req.cookies?.[COOKIE_NAME];
    if (sessionToken) {
      try {
        const payload = await verifySessionToken(sessionToken);
        if (payload && payload.openId === "1") { // Assuming admin user has openId '1'
          user = { id: 1, openId: "1", name: "Admin", email: "admin@example.com", loginMethod: "password", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
        }
      } catch (error) {
        console.warn("[Auth] Invalid session token:", error);
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
