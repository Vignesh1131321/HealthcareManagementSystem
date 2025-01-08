// pages/api/uploadFHIR.js
import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { observationData } = req.body;

      // Initialize GoogleAuth with your Service Account JSON file
      const auth = new GoogleAuth({
        keyFilename: './keys/service-account-key.json', // Path to your service account key JSON file
        scopes: ['https://www.googleapis.com/auth/cloud-healthcare'], // Required FHIR scope
      });

      const client = await auth.getClient();

      const fhirApiUrl = 'https://healthcare.googleapis.com/v1/projects/white-vortex-446716-m1/locations/asia-south1/datasets/Health_Records/fhirStores/sunhith_data_store_113/fhir/';

      const resourceData = {
        resourceType: "Observation",
        status: "final",
        code: {
          text: observationData.codeText, 
        },
        subject: {
          reference: `Patient/${observationData.patientId}`,
        },
        effectiveDateTime: observationData.effectiveDateTime, 
        valueQuantity: {
          value: observationData.value,
          unit: observationData.unit,
        },
      };

      const response = await axios.post(fhirApiUrl + 'Observation', resourceData, {
        headers: {
          Authorization: `Bearer ${await client.getAccessToken()}`, 
          'Content-Type': 'application/fhir+json',
        },
      });

      console.log('FHIR Record Uploaded Successfully:', response.data);
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Failed to upload FHIR record:', error);
      return res.status(500).json({ error: 'Failed to upload FHIR record' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
