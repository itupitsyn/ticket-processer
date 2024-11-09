import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.formData();
  const file = body.get("file") as unknown as File[] | null | File;

  if (!file) return new NextResponse("", { status: 418 });

  const simpleParser = require("mailparser").simpleParser;
  const result: { subject: string; text: string }[] = [];
  const prms: Promise<ReturnType<typeof simpleParser>>[] = [];
  const collection = Array.isArray(file) ? file : [file];

  for (let i = 0; i < collection.length; i += 1) {
    const dataBuffer = await collection[i].arrayBuffer();
    const utf8Decoder = new TextDecoder("UTF-8");
    prms.push(simpleParser(utf8Decoder.decode(dataBuffer)));
  }

  const parsed = await Promise.all(prms);
  parsed.forEach((item) => {
    result.push({ subject: item.subject, text: item.text });
  });

  return new NextResponse(JSON.stringify(result));
};
