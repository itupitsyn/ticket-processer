import { FullMsg, Msg } from "@/types";
import { askQWEN } from "./apiMethods";
import { SYSTEM_PROMPT_COMMON } from "@/constants";

export const downloadTextFile = (fileName: string, fileContent: string) => {
  var element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(fileContent));
  element.setAttribute("download", fileName);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const allowedProblems = [
  "Блок питания",
  "Материнская плата",
  "Матрица",
  "Вентилятор",
  "Сервер",
  "Wi-fi модуль",
  "Диск",
  "SFP модуль",
  "Оперативная память",
  "Программное обеспечение",
  "Клавиатура",
  "Корпус",
  "Аккумулятор",
  "Камера",
  "Wi-fi антенна",
  "Динамики",
  "Jack",
].map((item) => item.toLocaleLowerCase());

const allowedDevs = ["Ноутбук", "Сервер", "СХД"].map((item) => item.toLocaleLowerCase());

const getProblem = (problem: string) => {
  const text = problem.toLocaleLowerCase();
  if (text.includes("блок питания") || text.match(/(?<=[\s,.:;"']|^)бп(?=[\s,.:;"']|$)/gim) != null)
    return "Блок питания";
  if (text.includes("материнская") || text.includes("плата") || text.includes("процессор")) return "Материнская плата";
  if (text.includes("клавиатура")) return "Клавиатура";
  if (text.includes("матрица") || text.includes("экран")) return "Матрица";
  if (text.includes("вентилятор") || text.includes("кулер") || text.includes("система охлаждения")) return "Вентилятор";
  if (text.includes("сервер") || text.match(/(?<=[\s,.:;"']|^)комп/gim) != null) return "Сервер";
  if (text.includes("wi-fi") || text.includes("вайфай") || text.includes("wifi")) return "Wi-fi модуль";
  if (text.includes("диск")) return "Диск";
  if (text.includes("SFP")) return "SFP модуль";
  if (text.includes("память") || text.match(/(?<=[\s,.:;"']|^)оператив/gim) != null) return "Оперативная память";
  if (
    text.includes("программное обеспечение") ||
    text.match(/(?<=[\s,.:;"']|^)ПО(?<=[\s,.:;"']|&)/gim) != null ||
    text.match(/(?<=[\s,.:;"']|^)программ/gim) != null
  )
    return "Программное обеспечение";
  if (text.includes("корпус")) return "Корпус";
  if (text.includes("аккум")) return "Аккумулятор";
  if (text.includes("камера")) return "Камера";
  if (text.includes("антенна")) return "Wi-fi антенна";
  if (text.includes("динамики") || text.match(/(?<=[\s,.:;"']|^)звук(?<=[\s,.:;"']|&)/gim) != null) return "Динамики";
  if (text.includes("jack") || text.match(/джек(?<=[\s,.:;"']|&)/gim) != null) return "Jack";
  return "Программное обеспечение";
};

const getDevice = (device: string, problem: string) => {
  let text = device.toLocaleLowerCase();
  if (text.includes("сервер") || text.includes("сервак")) return "Сервер";
  if (text.includes("ноутбук") || text.includes("ноут") || text.includes("лэптоп")) return "Ноутбук";
  if (text.includes("схд") || text.includes("система хранения данных")) return "СХД";

  // догадки
  text = problem.toLocaleLowerCase();
  if (
    text.includes("матрица") ||
    text.includes("клавиатура") ||
    text.includes("jack") ||
    text.includes("wi-fi") ||
    text.includes("аккум") ||
    text.includes("камера") ||
    text.includes("динамик")
  )
    return "Ноутбук";

  if (text.includes("корпус") || text.includes("вентилятор") || text.includes("материнская плата")) return "Сервер";

  if (text.includes("диск")) return "СХД";

  return "Ноутбук";
};

export const getFullMsg = async (msg: Msg): Promise<FullMsg> => {
  const text = `${msg.subject}. ${msg.text}`.replace(/[^\w\s,.!\-]/gm, "").replace(/[\.]{2,}/gm, ".");
  const snRtoCheck = new RegExp(/^[a-zA-Z][a-zA-Z0-9]{9,15}$/);
  const snR = new RegExp(/[a-zA-Z][a-zA-Z0-9]{9,15}/);

  for (let i = 0; i < 3; i += 1) {
    try {
      const response = await askQWEN(text, SYSTEM_PROMPT_COMMON);
      const fields = JSON.parse(response.message.content);
      let pDevice = fields["device"];
      let pProblem = fields["problem"];
      let pSn = fields["sn"];

      // if (pDevice == undefined || pProblem == undefined || pSn == undefined) throw new Error();

      // // console.log({ pProblem, ok: allowedProblems.includes(pProblem.toLocaleLowerCase()) });
      // if (!allowedProblems.includes(pProblem.toLocaleLowerCase())) {
      //   pProblem = getProblem(pProblem);
      // }

      // // console.log({ pDevice, ok: allowedDevs.includes(pDevice.toLocaleLowerCase()) });
      // if (!allowedDevs.includes(pDevice.toLocaleLowerCase())) {
      //   pDevice = getDevice(pDevice, pProblem);
      // }

      // if (pSn.match(snRtoCheck) == null) {
      //   const fake = text.match(snR);
      //   if (!fake) pSn = "";
      //   else pSn = fake[0];
      // }

      return { ...msg, device: pDevice, problem: pProblem, sn: pSn };
    } catch {
      continue;
    }
  }

  return { ...msg, device: "", problem: "", sn: "" };

  // const pProblem = getProblem(text);

  // return { ...msg, device: getDevice(text, pProblem), problem: pProblem, sn: text.match(snR)?.[0] || "" };
};
