import axios from "axios";

export const processMessage = async (title: string, text: string) => {
  const response = await axios.post("/api/message", { title, text });
  return response.data;
};
