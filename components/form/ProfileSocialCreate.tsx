import { Input } from "@/components/ui/input";
import { createProducerCategory } from "@/supabase/producersService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Button } from "../sub/button";

const validationSchema = Yup.object().shape({
  categoryName: Yup.string()
    .required("El nombre de la categoría es requerido")
    .min(3, "El nombre de la categoría debe tener al menos 3 caracteres"),
});

type ProfileSocialCreateProps = {
  visible: boolean;
  onSocialCreated: () => void;
};

const ProfileSocialCreate = ({
  visible,
  onSocialCreated,
}: ProfileSocialCreateProps) => {
  const [selectedIcon, setSelectedIcon] =
    useState<string>("FeatherAlertCircle");

  return (
    <div
      className={
        "relative block flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm transition duration-200 ease-out"
      }
    >
      <Formik
        initialValues={{ categoryName: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const { data, error } = await createProducerCategory(
            values.categoryName,
            selectedIcon
          );
          if (error) {
            alert(`Error: ${error}`);
          } else {
            alert("Categoría creada exitosamente");
            resetForm();
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex w-full items-start justify-end gap-2">
            <div className="flex flex-col w-full">
              <Field
                as={Input}
                name="categoryName"
                className="h-auto grow shrink-0 basis-0 mb-2"
                placeholder="Nombre de la categoría"
              />
              <ErrorMessage
                name="categoryName"
                component="div"
                className="text-red-500 text-sm pt-1"
              />
            </div>
            <Button
              disabled={!isValid || isSubmitting}
              variant="neutral-primary"
              size="medium"
              icon={null}
              iconRight="FeatherSave"
              loading={isSubmitting}
              type="submit"
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileSocialCreate;
