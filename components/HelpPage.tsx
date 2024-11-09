"use client";

import { Button, Drawer, Tabs } from "flowbite-react";
import { FC, useState } from "react";
import { FieldsForm } from "./FieldsForm";
import { FilesForm } from "./FilesForm";

export const HelpPage: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} gradientDuoTone="purpleToPink">
        Подкинуть данных
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        className="md:min-w-[450px]"
      >
        <Drawer.Header title="Подкинуть данных" titleIcon={() => null} />
        <Drawer.Items>
          <Tabs variant="underline" color="purple">
            <Tabs.Item title="Поля">
              <FieldsForm />
            </Tabs.Item>
            <Tabs.Item title="Файлы">
              <FilesForm />
            </Tabs.Item>
            <Tabs.Item title="Почта"></Tabs.Item>
          </Tabs>
        </Drawer.Items>
      </Drawer>
    </>
  );
};
