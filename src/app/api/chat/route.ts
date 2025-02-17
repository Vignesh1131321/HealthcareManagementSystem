import {NextResponse} from "next/server";
import Groq from "groq-sdk"

const groq= new Groq({ apiKey:process.env.GROQ_API_KEY});


export async function POST(request:Request){
  try {
    const { message }= await request.json();
    if(!message){
      return NextResponse.json(
        {error: "Message content is required."},
        {status: 400}
      );
    }
    const chatCompletion = await groq.chat.completions.create({
      messages:[
        {
          role:"user",
          content:message,
        },
      ],
      model:"llama-3.3-70b-versatile"
    });
    const responseMessage=
    chatCompletion.choices[0]?.message?.content||"No reponse from LLama.";

    return NextResponse.json({response:responseMessage});
  } catch (error) {
    console.error("Error in chat API", error);
    return NextResponse.json(
      {error: "An error occured while processing your request."},
      {status: 500}
    );
  }
}
