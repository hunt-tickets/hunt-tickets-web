"use client";

import { createProducer } from "@/supabase/producersService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import DrawerHeader from "../site/DrawerHeader";
import { DrawerLayout } from "../site/DrawerLayout";
import { HelpText } from "../site/HelpText";
import { PhoneInput } from "../site/PhoneInput";
import { Button } from "../sub/button";
import { CheckboxCard } from "../sub/CheckboxCard";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type DrawerProfileCreateProps = {
  open: boolean;
  close: () => void;
};

const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  description: Yup.string()
    .required("La descripción es requerida")
    .max(652, "La descripción debe tener menos de 250 caracteres"),
  publicEmail: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo es obligatorio"),
  phone: Yup.string()
    .matches(
      /^\+\d{9,15}$/,
      "El teléfono debe incluir el código del país y contener entre 9 y 15 dígitos"
    )
    .required("El teléfono es requerido"),
});

const DrawerProfileCreate = ({ open, close }: DrawerProfileCreateProps) => {
  const initialValues = {
    name: "",
    description: "",
    publicEmail: "",
    phone: "",
  };

  const [checked, setChecked] = useState(false);

  const handleSubmit = async (values: typeof initialValues) => {
    const producerData = {
      name: values.name,
      description: values.description,
      email: values.publicEmail,
      phone: values.phone,
    };

    const { error, success } = await createProducer(producerData);

    if (error) {
      console.log("Error al crear el productor:", error);
      alert(`Error al crear el productor: ${error}`);
    } else {
      console.log(success);
      alert(success);
      close();
    }
  };
  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
  };

  return (
    <DrawerLayout open={open} onOpenChange={() => {}}>
      <div className="flex h-full w-full flex-col items-start gap-1 bg-default-background">
        <div
          className="flex w-full flex-col items-start gap-8 px-8 pt-8"
          onClick={close}
        >
          <DrawerHeader title="Crear nuevo productor" />
        </div>
        <div className="flex w-full min-w-[450px] flex-col items-start gap-10 px-8 py-8">
          <div className="flex w-full flex-col items-start gap-4">
            <Formik
              initialValues={initialValues}
              validationSchema={profileValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="flex w-full flex-col gap-8">
                  <div className="flex w-full flex-col gap-1.5">
                    <label htmlFor="name">Nombre</label>
                    <Field
                      as={Input}
                      className="w-full"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Nombre completo"
                    />
                    <HelpText>
                      Este es el nombre que se va a mostrar públicamente.
                    </HelpText>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1.5">
                    <label htmlFor="description">Descripción</label>
                    <Field
                      as={Textarea}
                      className="w-full"
                      id="description"
                      name="description"
                      type="text"
                      placeholder="Descripción"
                    />
                    <HelpText>
                      Esta información se va a mostrar públicamente
                    </HelpText>
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1.5">
                    <label htmlFor="publicEmail">Correo electrónico</label>
                    <Field
                      as={Input}
                      className="w-full"
                      id="publicEmail"
                      name="publicEmail"
                      type="email"
                      placeholder="e.j., jml@gmail.com"
                    />
                    <HelpText>
                      Tu correo electrónico es esencial para comunicarnos
                      contigo fácilmente desde HUNT
                    </HelpText>
                    <ErrorMessage
                      name="publicEmail"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-1.5">
                    <label htmlFor="phone">Teléfono</label>
                    <PhoneInput
                      className="w-full"
                      value={values.phone}
                      onChange={(value: string) =>
                        setFieldValue("phone", value)
                      }
                      defaultCountry="CO"
                      placeholder="e.j., +57 317 828 38 38"
                    />
                    <HelpText>
                      Es necesario que tu número de teléfono tenga acceso a
                      Whatsapp para comunicarnos contigo fácilmente desde HUNT
                    </HelpText>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <CheckboxCard
                    className="w-full grow shrink-0 basis-0"
                    checked={checked}
                    onCheckedChange={handleCheckedChange}
                  >
                    <span className="text-caption-bold font-caption-bold text-subtext-color">
                      Aceptar Términos &amp; Condiciones
                    </span>
                  </CheckboxCard>
                  <Button
                    className="w-full"
                    variant="neutral-primary"
                    size="large"
                    type="submit"
                    loading={isSubmitting}
                  >
                    Crear productor
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </DrawerLayout>
  );
};

export default DrawerProfileCreate;
