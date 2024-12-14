import mongoose from "mongoose";

export async function connect(){
  try{
    mongoose.connect(process.env.MONGO_URI!)
    const connection = mongoose.connection;

    connection.once('connected',()=>{
      console.log('Connected to MongoDB');
    })

    connection.on('error',(err)=>{
      console.log('Error connecting to MongoDB');
      console.log(err);
      process.exit();
    })

  }catch(error){
    console.log('Something went wrong');
    console.log(error);
  }
}