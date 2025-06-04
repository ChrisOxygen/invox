import { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      emailVerified: boolean | null;
    } & DefaultSession["user"];
  }
}
