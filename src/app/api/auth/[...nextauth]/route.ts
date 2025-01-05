// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { authOptions } from "@lib/auth";



// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import { authOptions } from "@lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
