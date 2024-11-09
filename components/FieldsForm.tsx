"use client";

import { processMessage } from "@/utils/apiMethods";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import * as yup from "yup";

type FieldsFormData = {
  subject: string;
  text: string;
};

const schema = yup.object().shape({
  subject: yup.string().nullable().required("Обязательное поле"),
  text: yup.string().nullable().required("Обязательное поле"),
});

export const FieldsForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FieldsFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      text: "",
      subject: "",
    },
  });

  const submitHandler: SubmitHandler<FieldsFormData> = useCallback(
    async (formData) => {
      try {
        await processMessage(formData.subject, formData.text);
        reset();
      } catch {
        toast("Неизвестная ошибка", { type: "error" });
      }
    },
    [reset],
  );

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col">
      <div className="mb-2">
        <Label>Заголовок письма</Label>
      </div>
      <Controller
        control={control}
        name="subject"
        render={({ field }) => (
          <TextInput
            {...field}
            color={errors.subject?.message && "failure"}
            helperText={errors.subject?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <div className="mb-2 mt-6">
        <Label>Текст письма</Label>
      </div>
      <Controller
        control={control}
        name="text"
        render={({ field }) => (
          <Textarea
            {...field}
            rows={10}
            color={errors.text?.message && "failure"}
            helperText={errors.text?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Button type="submit" className="mt-2 self-end" disabled={isSubmitting} gradientDuoTone="purpleToPink">
        Отправить
      </Button>
    </form>
  );
};
