"use client";

import { useUploadBanner } from "@/hook/useUploadBanner";
import { useUploadLogo } from "@/hook/useUploadLogo";
import { updateProducer } from "@/supabase/producersService";
import { Producer } from "@/types/site";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Button } from "../sub/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type ProfileEditProps = {
  close: () => void;
  producer: any;
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

const ProfileEdit = ({
  close,
  producer,
  onUpdateProducer,
}: ProfileEditProps) => {
  const {
    uploadLogo,
    loading: logoLoading,
    error: logoError,
  } = useUploadLogo();
  const {
    uploadBanner,
    loading: bannerLoading,
    error: bannerError,
  } = useUploadBanner();
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    name: producer.name || "",
    description: producer.description || "",
    email: producer.email || "",
    phone: producer.phone || "",
    logo: producer.logo || "",
    banner: producer.banner || "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setSubmitting(true);

    let logoUrl: string | undefined = producer.logo;
    let bannerUrl: string | undefined = producer.banner;

    if (selectedLogo) {
      const response = await uploadLogo(producer.id, selectedLogo);
      if (response.error) {
        console.log("Error al subir el logo:", response.error);
      } else {
        logoUrl = response.success || producer.logo;
      }
    }

    if (selectedBanner) {
      const response = await uploadBanner(producer.id, selectedBanner);
      if (response.error) {
        console.log("Error al subir el banner:", response.error);
      } else {
        bannerUrl = response.success || producer.banner;
      }
    }

    const updates = {
      id: producer.id,
      name: values.name,
      description: values.description,
      email: values.email,
      phone: values.phone,
      logo: logoUrl,
      banner: bannerUrl,
    };

    const { error, success } = await updateProducer(updates);

    if (error) {
      console.log("Error al actualizar el productor:", error);
      alert(`Error al actualizar el productor: ${error}`);
    } else {
      console.log("✅ Productor actualizado correctamente:", updates);
      alert(success);
      close();
    }
    setSubmitting(false);
  };

  return (
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
                  <label htmlFor="banner">Banner</label>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] || null;
                      setSelectedBanner(file);
                    }}
                  />
                  {selectedBanner && (
                    <p className="text-sm text-gray-400">
                      📁 Archivo: {selectedBanner.name}
                    </p>
                  )}
                  {producer.banner && (
                    <p className="text-sm text-gray-400">
                      📁 Archivo: {producer.banner}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <label htmlFor="create_logo">Logo</label>
                  <Input
                    id="create_logo"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0] || null;
                      setSelectedLogo(file);
                    }}
                  />
                  {selectedLogo && (
                    <p className="text-sm text-gray-400">
                      📁 Archivo: {selectedLogo.name}
                    </p>
                  )}
                  {producer.logo && (
                    <p className="text-sm text-gray-400">
                      📁 Archivo: {producer.logo}
                    </p>
                  )}
                </div>
              </div>
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
  );
};

export default ProfileEdit;
