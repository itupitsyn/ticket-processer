# Приложение для помощи сотруднику первой линии поддержки

## Требования

Для работы приложения необходима NodeJS не ниже 18 версии

## Установка и запуск

Приложение работает в связке с Ollama.
Для её установки и запуска необходимо выполнить инструкции на странице https://ollama.com/download

после запуска необходимо загрузить модель qwen. Для этого необходимо в терминале выполнить

```
ollama run qwen2.5
```

Следующим шагом необходимо перейти в папку с исходным кодом приложения и установить зависимости, выполнив

```
npm i
```

После установки зависимостей необходимо в этой же папке создать файл .env со следующим содержимым

```
OOLAMA_URL="http://localhost:11434"
```

Теперь можно приступить к билду. Для этого применяется команда

```
npm run build
```

Для запуска необходимо выполнить

```
npm start
```

В случае успешного старта приложение доступно по адресу http://localhost:3000

## Как пользоваться приложением

Подразумевается, что приложение является промежуточным звеном между почтой, в которую падают заявки от клиентов, и таск трекером. Его задачей является автоматизированное заполнение необходимых полей в заявках таск трекера.

На главной странице есть кнопка "Получить данные", нажатие по которой открывает боковую панель с возможными вариантами загрузки данных из почты

![alt text](images/image.png)

![alt text](images/image-1.png)

Существует возможно загрузки данных вручную через поля, а так же из файлов csv и eml

Для загрузки данных из файлов необходимо перейти на вкладку "Файлы" и кликнуть по полю "Выбрать файлы". Откроется окно выбора файлов. Можно выбирать сразу несколько файлов разных форматов.

![alt text](images/image-2.png)

После подтверждения выбора необходимо нажать кнопку "Отправить", чтобы получить заполненные нейросетью данные.

![alt text](images/image-3.png)

Начнётся обработка текстов писем

![alt text](images/image-4.png)

После окончания обработки на странице приложения появится таблица с полями. Если какое-то поле не удалось запомнить, то оно будет заполнено ключевым словом УТОЧНИТЬ.

![alt text](images/image-5.png)

Также справа появится кнопка "Обработка", нажатие на которую приведёт к открытие панели фильтров и выгрузки данных.

![alt text](images/image-6.png)

После фильтрации результирующую таблицу можно выгрузить в csv формате, либо в JSON для последующей загрузки в таск трекер. Приложение можно доработать, чтобы выгрузка осуществлялась напрямую в таск трекер.

## API

Для обработки текстов писем реализованы методы api, к которым можно обращаться напрямую, минуя веб приложение. Они доступны по адресам '/api/message' для обработки текста в формате JSON. В теле POST запроса ожидается объект вида

```
{
  subject: string;
  text: string;
}
```

Для обработки файлов используется метод `/api/binaryMessages` ожидается массив объектов типа `File`.

Результатом работы методов являются объекты вида

```
{
  subject: string;
  text: string;
  problem: string;
  device: string;
  sn: string;
}
```
