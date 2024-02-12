import { OpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
   
    const body = await request.json();
    const { customPrompt } = body;
    console.log(customPrompt);

   //const prompt="Life and philosophy quotes";

    const model = new OpenAI({
      modelName: "gpt-3.5-turbo-instruct",
      temperature: 0.6,
      openAIApiKey: process.env.OPEN_API_KEY,
    });

    // Generate quotes using OpenAI
    // Generate quotes using OpenAI
    //const prompt = "Give me 15 encouraging or inspirational technologist-centric quotes in this format: \"Author: This is the first inspirational quote.\", \"Author: This is the second inspirational quote.\", Please do not give any incomplete sentences with double quotes missing at the end";
    const fullPrompt = customPrompt + "  in this format: \"Author: This is the first inspirational quote.\", \"Author: This is the second inspirational quote.\", Please do not give any incomplete sentences with double quotes missing at the end";
    console.log(fullPrompt);
    const res = await model.invoke(fullPrompt);

    console.log(res);
    // Split the response into lines and extract quotes
    const lines = res.split('\n');
    const quotes = [];

    for (const line of lines) {
      // Adjusted regex to match the format properly
      const match = line.match(/"([^:]+): (.+)"/);
      if (match && match.length === 3) {
        const author = match[1];
        const quote = match[2];
        quotes.push({ quote, author });
      } else {
        console.warn('Incomplete or invalid data found:', line);
      }
    }
    // // Create a CSV file and write quotes to it
    // const csvWriter = createObjectCsvWriter({
    //   path: 'quotes.csv',
    //   header: [
    //     { id: 'quote', title: 'Quote' },
    //     { id: 'author', title: 'Author' },
    //   ],
    // });

    // await csvWriter.writeRecords(quotes);
    // console.log('CSV file created successfully');

    console.log({ quotes });

    return NextResponse.json({ message: quotes });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.error();
  }
}

