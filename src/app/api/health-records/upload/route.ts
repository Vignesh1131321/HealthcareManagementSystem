import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import HealthRecord from '../../../../models/healthRecord'; // Ensure the import path is correct for your project

// Disable the body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disabling body parser for file uploads
  },
};

// Function to parse the form data
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    multiples: false, // Only one file upload is allowed
    uploadDir: path.join(process.cwd(), '/public/uploads'), // Ensure this directory exists and is writable
    filename: (originalName, ext, part) => {
      return `${Date.now()}_${originalName}`; // Add a timestamp to avoid duplicate filenames
    },
    filter: (part) => {
      // Accept only PDF, DOCX, JPG, and PNG files
      return part.name === 'file' && /\.(pdf|docx|jpg|png)$/i.test(part.originalFilename || '');
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // If method is not POST, return 405 error
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Parse the incoming form data
    const { fields, files } = await parseForm(req);

    // Log the fields and files to ensure they are correctly parsed
    console.log('Parsed Fields:', fields);
    console.log('Parsed Files:', files);

    const { username, description } = fields;

    // Ensure that both username and description are provided
    if (!username || !description) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if the file exists and handle appropriately
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Path where the file will be moved after parsing
    const filePath = file.filepath;
    const newFilePath = path.join(process.cwd(), '/public/uploads', file.originalFilename || file.newFilename);

    // Move the file to the new location
    fs.renameSync(filePath, newFilePath);

    // Save health record in the database
    const record = new HealthRecord({
      username,
      description,
      pdfFileUrl: `/uploads/${file.originalFilename || file.newFilename}`,
    });

    await record.save();

    // Respond with success
    return res.status(200).json({
      success: true,
      message: 'Health record uploaded successfully',
      data: record,
    });
  } catch (error: any) {
    // Log and handle any errors that occur during the process
    console.error('Error in file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
}
