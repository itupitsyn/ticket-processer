import { SYSTEM_PROMPT } from "@/constants";
import { FullMsg, Msg, QWENResponse } from "@/types";
import axios from "axios";

export const processMessage = async (subject: string, text: string) => {
  const response = await axios.post<FullMsg>("/api/message", { subject, text });

  return response.data;
};

export const processBinaryMessages = async (files: File[]) => {
  const data = new FormData();
  files.forEach((file, idx) => {
    data.append(`file[${idx}]`, file);
  });
  const response = await axios.post<FullMsg[]>("/api/binaryMessages", data);

  return response.data;
};

export const askQWEN = async (message: Msg) => {
  const response = await axios.post<QWENResponse>(`${process.env.OOLAMA_URL}/api/chat`, {
    model: "qwen2.5:7b",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `${message.subject}. ${message.text}` },
    ],
    stream: false,
  });

  return response.data;
};
