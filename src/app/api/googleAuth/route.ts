import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    // Load the service account key file
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '');

    // Create a JWT client using the service account credentials
    const jwtClient = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'], // Adjust the scopes based on your needs
    });

    // Generate the access token using the JWT client
    const accessToken = await jwtClient.authorize();

    // Return the access token to the frontend
    return new Response(
      JSON.stringify({ accessToken: accessToken.access_token }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Service Account Auth Error:', error);
    return new Response('Failed to fetch access token using service account', { status: 500 });
  }
}
