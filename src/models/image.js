import mongoose from 'mongoose'


const ImageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    data:{
        type:Buffer,
        required:true
    },
    contentType:{
        type:String,
        required:true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference the user


})

export const Image = mongoose.models.Image || mongoose.model('Image',ImageSchema)