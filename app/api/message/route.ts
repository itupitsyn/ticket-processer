import { Msg } from "@/types";
import { askQWEN } from "@/utils/apiMethods";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body: Msg = await request.json();
  const response = await askQWEN(body);
  const fields = await JSON.parse(response.message.content);

  return new NextResponse(JSON.stringify({ ...body, ...fields }));
};
