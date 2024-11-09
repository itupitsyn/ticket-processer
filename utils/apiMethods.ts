import axios from "axios";

export const processMessage = async (title: string, text: string) => {
  const response = await axios.post("/api/message", { title, text });
  return response.data;
};

export const processBinaryMessages = async (files: File[]) => {
  const data = new FormData();
  files.forEach((file) => data.append("file", file));
  const response = await axios.post("/api/binaryMessages", data);
  return response.data;
};
