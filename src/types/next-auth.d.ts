import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string;
    username?: string;
    points?: number;
  }
  interface Session {
    user: {
      role?: string;
      username?: string;
      points?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    username?: string;
    points?: number;
  }
}
