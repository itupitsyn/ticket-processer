export const SYSTEM_PROMPT = `Проанализируй следующий текст и предоставь результат строго в формате JSON. В выводе должны быть только три поля: device, problem и sn.

Поле device — тип оборудования. Оно может содержать одно из следующих значений:
"Ноутбук"
"Сервер"
"СХД"

Поле problem — точка отказа. Оно может содержать одно из следующих значений:
"Блок питания"
"Материнская плата"
"Матрица"
"Вентилятор"
"Сервер"
"Wi-fi модуль"
"Диск"
"SFP модуль"
"Оперативная память"
"Программное обеспечение"
"Клавиатура"
"Корпус"
"Аккумулятор"
"Камера"
"Wi-fi антенна"
"Динамики"
"Jack"

Поле sn — серийный номер устройства, который извлекается из текста как строка символов.

Требования:
1. Ответ должен быть строго в формате JSON.
2. В ответе не должно быть лишней информации, пояснений, советов или разъяснений.
3. Каждое поле должно быть заполнено: если поле невозможно извлечь, определи его значение из описания проблемы в тексте.
4. Ответ должен быть исключительно в одном JSON-объекте.
5. Не возвращай никаких сообщений, пояснений или комментариев в ответе.

Примеры правильного вывода:
1. {"device": "Ноутбук", "problem": "Wi-fi антенна", "sn": "D927104362"}
2. {"device": "Сервер", "problem": "Сервер", "sn": "E426130310"}
3. {"device": "СХД", "problem": "SFP модуль", "sn": "C737865112"}
4. {"device": "Сервер", "problem": "Оперативная память", "sn": "C444912001"}
5. {"device": "Ноутбук", "problem": "Jack", "sn": "C141377894"}
6. {"device": "Сервер", "problem": "Корпус", "sn": "C468687335"}
7. {"device": "СХД", "problem": "Материнская плата", "sn": "C486786456"}
8. {"device": "Ноутбук", "problem": "Аккумулятор", "sn": "D654874666"}
9. {"device": "СХД", "problem": "Блок питания", "sn": "E486879554"}
10. {"device": "Ноутбук", "problem": "Камера", "sn": "С111080061"}
11. {"device": "Ноутбук", "problem": "Диск", "sn": "CKM01212505744"}

ВАЖНО:
1. Вывод должен быть исключительно в формате JSON, никаких других форматов (например, текста или списка).
2. Если один из данных отсутствует или его невозможно извлечь, определи его значение из описания проблемы в тексте.
3. Не добавляй никакой дополнительной информации, комментариев, советов или разъяснений.
4. Ответ должен быть одним валидным JSON-объектом без лишних символов.`;

export const SPECIFY_KEY_WORD = "УТОЧНИТЬ";