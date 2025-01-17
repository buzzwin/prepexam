import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

export const preferredRegion = "sin1";
export const maxDuration = 50;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 500 });
    }

    const freeTrial = await checkApiLimit(userId);
    if (!freeTrial) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }

    const response = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt,
        },
      }
    );

    await increaseApiLimit(userId);

    return NextResponse.json(response);
  } catch (error) {
    console.log("Video Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
