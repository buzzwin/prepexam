import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { OpenAI } from "@langchain/openai";

export async function POST(request: Request) {
  const body = await request.text();


const model = new OpenAI({
  modelName: "gpt-3.5-turbo-instruct", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
  temperature: 0.9,
  openAIApiKey: process.env.OPEN_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
});
const prompt = "Generate a high school-level SAT Math question complete with multiple-choice answers, indicate the correct answer, and provide a detailed explanation. The question should test mathematical concepts commonly found in the SAT, such as algebra, geometry, or basic trigonometry. Please ensure the question is challenging, reflects the style and complexity of actual SAT questions, and the explanation helps in understanding the underlying concepts. Can you give me this in a JSON format only with question labeled as \"question\", choices labeled as \"choice_1\", \"choice_2\", etc., and the correct answer labeled as \"answer\" and the value of the current answer as \"choice_1\" and the explanation of the answer labeled as \"explanation\"? The format should be exactly like this sample: {\"question\": \"The perimeter of a rectangle is 60 inches. If the length is 10 inches longer than the width, what is the area of the rectangle?\", \"choice_1\": \"240 square inches\", \"choice_2\": \"360 square inches\", \"choice_3\": \"480 square inches\", \"choice_4\": \"600 square inches\", \"answer\": \"choice_3\", \"explanation\": \"The perimeter of a rectangle is equal to 2(length + width). In this equation, we are given the perimeter of 60 inches, so we can set it up as 60 = 2(x + x+10). Solving for x, we get x = 20, which means the width is 20 inches. Therefore, the length is 20+10= 30 inches. The area of a rectangle is length x width, so the area is 20 x 30 = 600 square inches.\" }";

const res = await model.invoke(prompt);


console.log({ res });
const cleanedRes = res.replace(/\n/g, '').replace(/\r/g, ''); // removes newlines and carriage returns
console.log({ cleanedRes });

  return NextResponse.json({ message:cleanedRes.trim() });
}
