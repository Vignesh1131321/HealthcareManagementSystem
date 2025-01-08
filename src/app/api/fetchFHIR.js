// pages/api/fetchFHIR.js
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Initialize GoogleAuth with your Service Account JSON file
      const auth = new GoogleAuth({
        keyFilename: './keys/service-account-key.json', // Path to your service account key JSON file
        scopes: ['https://www.googleapis.com/auth/cloud-healthcare'], // Required FHIR scope
      });

      const client = await auth.getClient();
      const fhirApiUrl = 'https://healthcare.googleapis.com/v1/projects/white-vortex-446716-m1/locations/asia-south1/datasets/Health_Records/fhirStores/sunhith_data_store_113/fhir/';

      // Fetch FHIR records
      const fhirRecords = await axios.get(`${fhirApiUrl}Observation?_count=10`, {
        headers: {
          Authorization: `Bearer ${await client.getAccessToken()}`,
        },
      });

      const mappedRecords = fhirRecords?.data?.entry?.map((entry) => ({
        id: entry.resource.id,
        resourceType: entry.resource.resourceType,
        date: entry.resource.effectiveDateTime,
        description: entry.resource.code?.text || 'No description',
        doctor: entry.resource.performer?.[0]?.display || 'Unknown',
      }));

      return res.status(200).json(mappedRecords);
    } 
    catch (error) {
      console.error('Failed to fetch FHIR records:', error);
      return res.status(500).json({ error: 'Failed to fetch FHIR records' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
