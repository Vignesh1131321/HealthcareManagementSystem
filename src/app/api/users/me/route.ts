import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/db"; // Import MongoDB client

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      { status: 401 }
    );
  }

  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db("test"); // Use "test" as the database name

    // Find the user by email
    const user = await db.collection("users").findOne({
      email: session.user.email, // Match the user's email
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Exclude sensitive fields (like password) before sending the response
    const { password, ...userData } = user;

    return new Response(JSON.stringify({ data: userData }), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
