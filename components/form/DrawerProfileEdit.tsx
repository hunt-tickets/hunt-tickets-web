"use client";

import { updateProducer } from "@/supabase/producersService";
import { Producer } from "@/types/site";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import DrawerHeader from "../site/DrawerHeader";
import Drawer from "react-modern-drawer";
import { Button } from "../sub/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
type DrawerProfileEditProps = {
  open: boolean;
  close: () => void;
  producer: Producer;
  onUpdateProducer: (updatedProducer: Producer) => void;
};

const profileEditValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  description: Yup.string()
    .required("La descripción es requerida")
    .max(652, "La descripción debe tener menos de 250 caracteres"),
});

const DrawerProfileEdit = ({
  open,
  close,
  producer,
  onUpdateProducer,
}: DrawerProfileEditProps) => {
  const initialValues = {
    name: producer.name || "",
    description: producer.description || "",
    email: producer.email || "",
    phone: producer.phone || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const updates = {
      id: producer.id,
      name: values.name,
      description: values.description,
      email: values.email,
      phone: values.phone,
    };

    const { error, success } = await updateProducer(updates);

    if (error) {
      console.log("Error al actualizar el productor:", error);
      alert(`Error al actualizar el productor: ${error}`);
    } else {
      console.log(success);
      alert(success);
      onUpdateProducer({
        ...producer,
        name: updates.name,
        description: updates.description,
        email: updates.email,
        phone: updates.phone,
      });
      close();
    }
  };

  return (
    <Drawer open={open} onClose={close} direction="right" size={450}>
      <div className="flex h-full w-full flex-col items-start gap-1 bg-default-background">
        <div
          className="flex w-full flex-col items-start gap-8 px-8 pt-8"
          onClick={close}
        >
          <DrawerHeader title="Editar perfil" />
        </div>
        <div className="flex w-full min-w-[450px] flex-col items-start gap-10 px-8 py-8">
          <div className="flex w-full flex-col items-start gap-4">
            <Formik
              initialValues={initialValues}
              validationSchema={profileEditValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="flex w-full flex-col gap-8">
                  <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border px-6 py-6">
                    <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-6">
                      <div className="flex w-full flex-col gap-1.5">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <label htmlFor="Picture">Picture</label>
                          <Input id="picture" type="file" />
                        </div>
                      </div>
                      <div className="flex w-full flex-col gap-1.5">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <label htmlFor="Picture">Picture</label>
                          <Input id="picture" type="file" />
                        </div>
                      </div>
                      {/* <FormInput label="Apellido" name="lastName" /> */}
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
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex w-full flex-col gap-1.5">
                        <label htmlFor="email">Email</label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="email"
                          name="email"
                          type="text"
                          placeholder="Correo electrónico"
                          disabled={producer.email}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex w-full flex-col gap-1.5">
                        <label htmlFor="phone">Teléfono</label>
                        <Field
                          as={Input}
                          className="w-full"
                          id="phone"
                          name="phone"
                          type="text"
                          placeholder="Teléfono"
                          disabled={producer.phone}
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-end gap-2">
                    <div className="flex w-full flex-wrap items-center justify-between">
                      <div className="flex grow shrink-0 basis-0 flex-wrap items-center justify-end gap-2">
                        <Button variant="neutral-secondary" onClick={close}>
                          Cancelar
                        </Button>
                        <div className="flex items-center justify-end gap-2">
                          <Button type="submit" loading={isSubmitting}>
                            Confirmar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerProfileEdit;
