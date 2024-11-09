"use client";

import { Tabs } from "flowbite-react";
import { FC } from "react";
import { FieldsForm } from "./FieldsForm";
import { FilesForm } from "./FilesForm";

export const HelpPage: FC = () => {
  return (
    <Tabs variant="underline" color="purple">
      <Tabs.Item title="Поля">
        <FieldsForm />
      </Tabs.Item>
      <Tabs.Item title="Файлы">
        <FilesForm />
      </Tabs.Item>
      <Tabs.Item title="Почта"></Tabs.Item>
    </Tabs>
  );
};
