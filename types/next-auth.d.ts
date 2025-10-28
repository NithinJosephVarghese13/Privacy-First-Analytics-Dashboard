import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      roles: string[];
    };
  }

  interface User {
    roles: string[];
  }
}
