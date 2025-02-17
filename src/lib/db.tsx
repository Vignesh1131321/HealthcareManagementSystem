import { MongoClient } from "mongodb";

const uri: string | undefined = "mongodb+srv://chandu:Chandu123@cluster0.pibcc.mongodb.net/";

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the value across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, don't use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Optional: Export types for your database collections
export interface IAppointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  date: Date;
  time: string;
  location?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatient {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
}

export interface IDoctor {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  department?: string;
}