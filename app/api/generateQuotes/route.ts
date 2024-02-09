import { OpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { createObjectCsvWriter } from 'csv-writer';
import { Request } from "@vercel/node";

export async function POST(request: Request) {
  try {
    const model = new OpenAI({
      modelName: "gpt-3.5-turbo-instruct",
      temperature: 0.6,
      openAIApiKey: process.env.OPEN_API_KEY,
    });

    // Generate quotes using OpenAI
    const prompt = "Give me 15 encouraging or inspirational technologist-centric quotes in this format: \"Author: This is the first inspirational quote.\", \"Author: This is the second inspirational quote.\", Please do not give any incomplete sentences with double quotes missing at the end";
    const res = await model.invoke(prompt);

    // Split the response into lines and extract quotes
    const lines = res.split('\n');
    const quotes = [];

    for (const line of lines) {
      const match = line.match(/"(.+): (.+)"/);
      if (match && match.length === 3) {
        const author = match[1];
        const quote = match[2];
        quotes.push({ quote, author });
      } else {
        console.warn('Incomplete or invalid data found:', line);
      }
    }

    // Create a CSV file and write quotes to it
    const csvWriter = createObjectCsvWriter({
      path: 'quotes.csv',
      header: [
        { id: 'quote', title: 'Quote' },
        { id: 'author', title: 'Author' },
      ],
    });

    await csvWriter.writeRecords(quotes);
    console.log('CSV file created successfully');

    console.log({ quotes });

    return NextResponse.json({ message: quotes });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.error();
  }
}
