"use client";

import { processBinaryMessages } from "@/utils/apiMethods";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FileInput } from "flowbite-react";
import { FC, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import * as yup from "yup";

type FilesFormType = {
  files: File[];
};

const schema = yup.object().shape({
  files: yup.array().nullable().required("Обязательное поле"),
});

export const FilesForm: FC = () => {
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
        await processBinaryMessages(formData.files);
        reset();
      } catch {
        toast("Неизвестная ошибка", { type: "error" });
      }
    },
    [reset],
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col"
    >
      <Controller
        control={control}
        name="files"
        render={({ field }) => (
          <FileInput
            multiple
            onChange={(e) => {
              if (!e.target.files) return;
              const arrayOfFiles: File[] = [];
              for (let i = 0; i < e.target.files.length; i += 1) {
                arrayOfFiles.push(e.target.files[0]);
              }
              field.onChange(arrayOfFiles);
            }}
            onBlur={field.onBlur}
            color={errors.files?.message && "failure"}
            helperText={errors.files?.message}
            disabled={isSubmitting}
          />
        )}
      />
      <Button
        type="submit"
        className="mt-2 self-end"
        disabled={isSubmitting}
        gradientDuoTone="purpleToPink"
      >
        Отправить
      </Button>
    </form>
  );
};
