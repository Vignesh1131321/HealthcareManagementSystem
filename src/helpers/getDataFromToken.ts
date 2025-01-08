import { NextRequest } from "next/server";
 import jwt from "jsonwebtoken";

// export const getDataFromToken = (request: NextRequest) => {
//   try {
//     const token = request.cookies.get("token")?.value;

//     console.log("getDataFromToken - Token:", token);

//     if (!token) {
//       throw new Error("Token not provided");
//     }

//     const secret = process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET;

//     if (!secret) {
//       throw new Error("JWT secret is not defined in the environment variables");
//     }

//     const decodedToken: any = jwt.verify(token, secret);

//     console.log("getDataFromToken - Decoded Token:", decodedToken);

//     if (!decodedToken || !decodedToken.id) {
//       throw new Error("Token is invalid or malformed");
//     }

//     return decodedToken.id;
//   } catch (error: any) {
//     console.error("getDataFromToken - Error:", error.message);
//     throw new Error("Authentication failed");
//   }
// };
export const getDataFromToken = (request: NextRequest) => {
  try {
    // const token = request.cookies.get("next-auth.session-token")?.value || request.cookies.get("next-auth.csrf-token")?.value;
    

    const sessionToken = request.cookies.get("next-auth.session-token")?.value;
if (!sessionToken) {
  throw new Error("Session token not found");
}

console.log("Session Token:", sessionToken);

    
     // Decode the token to log its content
     

    const secret = process.env.NEXTAUTH_SECRET;
  
    console.log("JWT Secret:", secret); // Debugging secret
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables");
    }

    const decodedToken: any = jwt.verify(sessionToken, secret);

    if (!decodedToken || !decodedToken.id) {
      throw new Error("Token is invalid or malformed");
    }

    return decodedToken.id;
  } catch (error: any) {
    console.error("getDataFromToken - Error:", error.message);
    throw new Error("Authentication failed");
  }
};
