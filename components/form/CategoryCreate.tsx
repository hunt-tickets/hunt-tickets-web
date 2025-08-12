import { Input } from "@/components/ui/input";
import { createProducerCategory } from "@/supabase/producersService";
import * as SubframeCore from "@subframe/core";
import { clsx } from "clsx";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Button } from "../sub/button";
import { Select } from "../sub/select";
const iconOptions = [
  {
    value: "FeatherAlertCircle",
    label: <SubframeCore.Icon name="FeatherAlertCircle" />,
  },
  {
    value: "FeatherAlarmPlus",
    label: <SubframeCore.Icon name="FeatherAlarmPlus" />,
  },
  { value: "FeatherAtom", label: <SubframeCore.Icon name="FeatherAtom" /> },
];

const validationSchema = Yup.object().shape({
  categoryName: Yup.string()
    .required("El nombre de la categoría es requerido")
    .min(3, "El nombre de la categoría debe tener al menos 3 caracteres"),
});

type CategoryCreateProps = {
  visible: boolean;
  onCategoryCreated: () => void;
};

const CategoryCreate = ({ visible, onCategoryCreated }: CategoryCreateProps) => {
  const [selectedIcon, setSelectedIcon] =
    useState<string>("FeatherAlertCircle");

  return (
    <div
      className={clsx(
        "relative block flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm transition duration-200 ease-out",
        {
          "ease-out": visible,
          "ease-in": !visible,
          "opacity-0": !visible,
          "opacity-100": visible,
          "-translate-y-full": !visible,
          "translate-y-0": visible,
        }
      )}
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
            onCategoryCreated();
            resetForm();
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex w-full items-start justify-end gap-2">
            {/* Select de Iconos */}
            <Select
              disabled={false}
              error={false}
              variant="outline"
              label=""
              placeholder="Select"
              helpText=""
              icon={null}
              value={selectedIcon}
              onValueChange={(value: string) => {
                setSelectedIcon(value);
              }}
            >
              {iconOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>

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

export default CategoryCreate;
