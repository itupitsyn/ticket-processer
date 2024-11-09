"use client";

import { FullMsg } from "@/types";
import { processBinaryMessages } from "@/utils/apiMethods";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FileInput } from "flowbite-react";
import { FC, useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import * as yup from "yup";

type FilesFormType = {
  files: File[];
};

const schema = yup.object().shape({
  files: yup.array().nullable().required("Обязательное поле"),
});

interface FilesFormProps {
  onAfterSubmit: (data: FullMsg[]) => void;
}

export const FilesForm: FC<FilesFormProps> = ({ onAfterSubmit }) => {
  const [fileKey, setFileKey] = useState(Math.random());
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FilesFormType>({
    resolver: yupResolver(schema),
  });

  const submitHandler: SubmitHandler<FilesFormType> = useCallback(
    async (formData) => {
      try {
        const data = await processBinaryMessages(formData.files);
        onAfterSubmit(data);
        setFileKey(Math.random());
        reset();
      } catch {
        toast("Неизвестная ошибка", { type: "error" });
      }
    },
    [onAfterSubmit, reset],
  );

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col">
      <Controller
        control={control}
        name="files"
        render={({ field }) => (
          <FileInput
            key={fileKey}
            multiple
            onChange={(e) => {
              if (!e.target.files) return;
              const arrayOfFiles: File[] = [];
              for (let i = 0; i < e.target.files.length; i += 1) {
                arrayOfFiles.push(e.target.files[i]);
              }
              field.onChange(arrayOfFiles);
            }}
            onBlur={field.onBlur}
            color={errors.files?.message && "failure"}
            helperText={errors.files?.message || "Файлы *.eml или *.csv"}
            disabled={isSubmitting}
            accept=".eml,.csv"
          />
        )}
      />
      <Button
        type="submit"
        className="mt-2 self-end"
        disabled={isSubmitting}
        gradientDuoTone="purpleToPink"
        isProcessing={isSubmitting}
      >
        Отправить
      </Button>
    </form>
  );
};
