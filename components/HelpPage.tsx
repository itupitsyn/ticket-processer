"use client";

import { Button, Drawer, Table, Tabs } from "flowbite-react";
import { FC, useCallback, useState } from "react";
import { FieldsForm } from "./FieldsForm";
import { FilesForm } from "./FilesForm";
import { FullMsg } from "@/types";
import { downloadTextFile } from "@/utils/commonMethods";
import { convertArrayToCSV } from "convert-array-to-csv";
import { SPECIFY_KEY_WORD } from "@/constants";
import classNames from "classnames";

export const HelpPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<FullMsg[]>([]);

  const onAfterSubmit = useCallback((data: FullMsg | FullMsg[]) => {
    const collection = Array.isArray(data) ? data : [data];
    setParsed(
      collection.map((item) => ({
        ...item,
        device: item.device || SPECIFY_KEY_WORD,
        problem: item.problem || SPECIFY_KEY_WORD,
        sn: item.sn || SPECIFY_KEY_WORD,
      })),
    );
    setOpen(false);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <Button onClick={() => setOpen(true)} gradientDuoTone="purpleToPink">
          Подкинуть данных
        </Button>
        {parsed.length > 0 && (
          <Button
            onClick={() => {
              const data = convertArrayToCSV(parsed);
              downloadTextFile(data);
            }}
            gradientDuoTone="purpleToPink"
          >
            Выгрузить в CSV
          </Button>
        )}
      </div>

      {parsed.length > 0 && (
        <Table className="mt-10">
          <Table.Head>
            <Table.HeadCell>Тема</Table.HeadCell>
            <Table.HeadCell>Обращение</Table.HeadCell>
            <Table.HeadCell>Тип оборудования</Table.HeadCell>
            <Table.HeadCell>Точка отказа</Table.HeadCell>
            <Table.HeadCell>Серийный номер</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {parsed.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{item.subject}</Table.Cell>
                <Table.Cell>{item.text}</Table.Cell>
                <Table.Cell className={classNames(item.device === SPECIFY_KEY_WORD && "text-red-500")}>
                  {item.device}
                </Table.Cell>
                <Table.Cell className={classNames(item.problem === SPECIFY_KEY_WORD && "text-red-500")}>
                  {item.problem}
                </Table.Cell>
                <Table.Cell className={classNames(item.sn === SPECIFY_KEY_WORD && "text-red-500")}>
                  {item.sn}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Drawer open={open} onClose={() => setOpen(false)} className="md:min-w-[450px]">
        <Drawer.Header title="Подкинуть данных" titleIcon={() => null} />
        <Drawer.Items>
          <Tabs variant="underline" color="purple">
            <Tabs.Item title="Поля">
              <FieldsForm onAfterSubmit={onAfterSubmit} />
            </Tabs.Item>
            <Tabs.Item title="Файлы">
              <FilesForm onAfterSubmit={onAfterSubmit} />
            </Tabs.Item>
            <Tabs.Item title="Почта"></Tabs.Item>
          </Tabs>
        </Drawer.Items>
      </Drawer>
    </>
  );
};
