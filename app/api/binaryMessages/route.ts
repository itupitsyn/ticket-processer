import { FullMsg, Msg } from "@/types";
import { getFullMsg } from "@/utils/commonMethods";
import * as CSV from "csv-string";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body = await request.formData();
  const collection: File[] = [];
  body.forEach((item) => collection.push(item as File));

  if (!collection.length) return new NextResponse("", { status: 418 });

  const msgs: Msg[] = [];
  const simpleParser = require("mailparser").simpleParser;
  const prms: Promise<ReturnType<typeof simpleParser>>[] = [];

  const parseFile = async (file: File) => {
    const dataBuffer = await file.arrayBuffer();
    const utf8Decoder = new TextDecoder("UTF-8");
    const text = utf8Decoder.decode(dataBuffer);

    if (file.name.toLocaleLowerCase().endsWith(".eml")) {
      const parsed = await simpleParser(text);
      return parsed;
    }

    const parsedFiles: Msg[] = [];
    const data = CSV.parse(text);
    for (let i = 1; i < data.length; i += 1) {
      if (data[i].length >= 3) {
        parsedFiles.push({ subject: data[i][1], text: data[i][2] });
      }
    }
    return parsedFiles;
  };

  for (let i = 0; i < collection.length; i += 1) {
    prms.push(parseFile(collection[i]));
  }

  const parsed = await Promise.all(prms);
  parsed.forEach((item) => {
    Array.isArray(item)
      ? item.forEach((curr) => msgs.push(curr))
      : msgs.push({ subject: item.subject, text: item.text });
  });

  const result: FullMsg[] = [];
  let promises: Promise<FullMsg>[] = [];

  for (let i = 0; i < msgs.length; i += 1) {
    if (promises.length && !(promises.length % 20)) {
      (await Promise.all(promises)).forEach((item) => result.push(item));
      promises = [];
    }
    promises.push(getFullMsg(msgs[i]));
  }
  if (promises.length) {
    (await Promise.all(promises)).forEach((item) => result.push(item));
  }

  return new NextResponse(JSON.stringify(result));
};
