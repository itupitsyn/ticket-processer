"use client";

import { Button, Checkbox, Drawer, Table, Tabs } from "flowbite-react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FieldsForm } from "./FieldsForm";
import { FilesForm } from "./FilesForm";
import { FullMsg } from "@/types";
import { downloadTextFile } from "@/utils/commonMethods";
import { convertArrayToCSV } from "convert-array-to-csv";
import { SPECIFY_KEY_WORD } from "@/constants";
import classNames from "classnames";
import Select, { ClassNamesConfig } from "react-select";
import { Options } from "react-select";

type Opt = { label: string; value: string };

type FullMsgWithId = FullMsg & { id: number };

const selectClassNames: ClassNamesConfig<Opt> = {
  container: (props) => classNames(props.className, "dark:bg-gray-800"),
  control: (props) => classNames(props.className, "dark:bg-gray-700"),
  option: (props) => classNames(props.className, "dark:bg-gray-700 dark:hover:bg-gray-800"),
  menuList: (props) => classNames(props.className, "dark:bg-gray-700"),
};

export const HelpPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<FullMsgWithId[]>([]);
  const [filtered, setFiltered] = useState<FullMsgWithId[]>([]);
  const [deviceOpts, setDeviceOpts] = useState<Options<Opt>>([]);
  const [problemOpts, setProblemOpts] = useState<Options<Opt>>([]);
  const [snOpts, setSnOpts] = useState<Options<Opt>>([]);
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<number, FullMsgWithId>>({});

  const [filters, setFilters] = useState<{ device: string[]; problem: string[]; sn: string[] }>({
    device: [],
    problem: [],
    sn: [],
  });

  const onAfterSubmit = useCallback((data: FullMsg | FullMsg[]) => {
    const collection = Array.isArray(data) ? data : [data];
    setParsed(
      collection.map((item) => ({
        ...item,
        id: Math.random(),
        device: item.device || SPECIFY_KEY_WORD,
        problem: item.problem || SPECIFY_KEY_WORD,
        sn: item.sn || SPECIFY_KEY_WORD,
      })),
    );
    setOpen(false);
    setAdditionalOpen(false);
    setSelectedItems({});
  }, []);

  useEffect(() => {
    const devs = new Set<string>();
    const sns = new Set<string>();
    const prblms = new Set<string>();

    parsed.forEach((item) => {
      devs.add(item.device);
      sns.add(item.sn);
      prblms.add(item.problem);
    });
    setDeviceOpts(Array.from(devs).map((item) => ({ label: item, value: item })));
    setSnOpts(Array.from(sns).map((item) => ({ label: item, value: item })));
    setProblemOpts(Array.from(prblms).map((item) => ({ label: item, value: item })));
    setFilters({ device: [], problem: [], sn: [] });
  }, [parsed]);

  useEffect(() => {
    setSelectedItems({});
    if (!filters.device && !filters.problem && !filters.sn) {
      setFiltered(parsed);
      return;
    }

    setFiltered(
      parsed.filter(
        (item) =>
          (filters.sn.length ? filters.sn.includes(item.sn) : true) &&
          (filters.device.length ? filters.device.includes(item.device) : true) &&
          (filters.problem.length ? filters.problem.includes(item.problem) : true),
      ),
    );
  }, [filters.device, filters.problem, filters.sn, parsed]);

  const cRef = useRef<HTMLInputElement>(null);
  const [checkAllState, setCheckAllState] = useState<boolean | undefined>(false);

  useEffect(() => {
    const checkedLength = Object.values(selectedItems).length;
    if (!checkedLength) {
      setCheckAllState(false);
    } else if (checkedLength === filtered.length) {
      setCheckAllState(true);
    } else {
      setCheckAllState(undefined);
    }
  }, [filtered.length, selectedItems]);

  useEffect(() => {
    if (!cRef.current) return;

    cRef.current.indeterminate = checkAllState == undefined;
  }, [checkAllState]);
  return (
    <>
      <div className="mt-10 flex items-center justify-between">
        <Button onClick={() => setOpen(true)} gradientDuoTone="purpleToPink">
          Получить данные
        </Button>
        {parsed.length > 0 && (
          <Button onClick={() => setAdditionalOpen(true)} gradientDuoTone="purpleToPink">
            Обработка
          </Button>
        )}
      </div>

      {parsed.length > 0 && (
        <Table className="mt-6">
          <Table.Head>
            <Table.HeadCell>
              <Checkbox
                ref={cRef}
                checked={checkAllState || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    const newVal: typeof selectedItems = {};
                    filtered.forEach((item) => (newVal[item.id] = item));
                    setSelectedItems(newVal);
                  } else {
                    setSelectedItems({});
                  }
                }}
              />
            </Table.HeadCell>
            <Table.HeadCell>Тема</Table.HeadCell>
            <Table.HeadCell>Обращение</Table.HeadCell>
            <Table.HeadCell>Тип оборудования</Table.HeadCell>
            <Table.HeadCell>Точка отказа</Table.HeadCell>
            <Table.HeadCell>Серийный номер</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filtered.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Checkbox
                    checked={!!selectedItems[item.id]}
                    onChange={() => {
                      setSelectedItems((prev) => {
                        const newVal = { ...prev };
                        if (!selectedItems[item.id]) newVal[item.id] = item;
                        else delete newVal[item.id];

                        return newVal;
                      });
                    }}
                  />
                </Table.Cell>
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
        <Drawer.Header title="Получить данные" titleIcon={() => null} />
        <Drawer.Items>
          <Tabs variant="underline" color="purple">
            <Tabs.Item title="Поля">
              <FieldsForm onAfterSubmit={onAfterSubmit} />
            </Tabs.Item>
            <Tabs.Item title="Файлы">
              <FilesForm onAfterSubmit={onAfterSubmit} />
            </Tabs.Item>
            <Tabs.Item title="Почта">Эта функция ещё в разработке</Tabs.Item>
          </Tabs>
        </Drawer.Items>
      </Drawer>

      <Drawer
        open={additionalOpen}
        onClose={() => setAdditionalOpen(false)}
        position="right"
        className="md:min-w-[450px]"
      >
        <Drawer.Header title="Обработка" titleIcon={() => null} />
        <Drawer.Items className="flex flex-col gap-4">
          <div>Фильтры</div>
          <Select
            classNames={selectClassNames}
            placeholder="Тип оборудования"
            noOptionsMessage={() => "Нет данных"}
            className="min-w-[200px]"
            options={deviceOpts}
            isClearable
            isMulti
            onChange={(opts) =>
              setFilters((prev) => ({ ...prev, device: opts ? Array.from(opts).map((item) => item.value) : [] }))
            }
          />
          <Select
            classNames={selectClassNames}
            placeholder="Точка отказа"
            noOptionsMessage={() => "Нет данных"}
            className="min-w-[200px]"
            options={problemOpts}
            isClearable
            isMulti
            onChange={(opts) =>
              setFilters((prev) => ({ ...prev, problem: opts ? Array.from(opts).map((item) => item.value) : [] }))
            }
          />
          <Select
            classNames={selectClassNames}
            placeholder="Серийный номер"
            noOptionsMessage={() => "Нет данных"}
            className="min-w-[200px]"
            options={snOpts}
            isClearable
            isMulti
            onChange={(opts) =>
              setFilters((prev) => ({ ...prev, sn: opts ? Array.from(opts).map((item) => item.value) : [] }))
            }
          />
          <Button
            className="mt-4"
            onClick={() => {
              const data = convertArrayToCSV(
                Object.values(selectedItems).map((item) => {
                  const { id, ...obj } = item;
                  return obj;
                }),
              );
              downloadTextFile("parsed-data.csv", data);
            }}
            disabled={!Object.values(selectedItems).length}
            gradientDuoTone="purpleToPink"
          >
            Выгрузить в CSV
          </Button>
          <Button
            onClick={() => {
              downloadTextFile(
                "parsed-data.json",
                JSON.stringify(
                  Object.values(selectedItems).map((item) => {
                    const { id, ...obj } = item;
                    return obj;
                  }),
                ),
              );
            }}
            disabled={!Object.values(selectedItems).length}
            gradientDuoTone="purpleToPink"
          >
            Выгрузить в Jira
          </Button>
        </Drawer.Items>
      </Drawer>
    </>
  );
};
