import { Msg } from "@/types";
import { getFullMsg } from "@/utils/commonMethods";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body: Msg = await request.json();
  const result = await getFullMsg(body);

  return new NextResponse(JSON.stringify(result));
};
