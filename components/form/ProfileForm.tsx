"use client";

import { useDocumentTypes } from "@/hook/useDocumentTypes";
import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CustomDatePicker from "../site/CustomDatePicker";
import FormInput from "../site/FormInput";
import FormSelect from "../site/FormSelect";
import { PhoneInput } from "../site/PhoneInput";
import { Button } from "../sub/button";
import { Label } from "../ui/label";

const profileValidationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  lastName: Yup.string().required("El apellido es obligatorio"),
  email: Yup.string()
    .email("Por favor, ingresa un correo válido")
    .required("El correo es obligatorio"),
  phone: Yup.string()
    .matches(
      /^\+\d{11,15}$/,
      "El número de teléfono debe incluir el código de país y tener entre 11 y 15 dígitos"
    )
    .required("El número de teléfono es obligatorio"),
  birthdate: Yup.date().required("La fecha de nacimiento es obligatoria"),
  gender: Yup.string().required("El género es obligatorio"),
  numberDocument: Yup.string().required(
    "El número de documento es obligatorio"
  ),
  documentTypeId: Yup.string().required("El tipo de documento es obligatorio"),
});
interface ProfileFormProps {
  message: string;
  phone: string | null;
  prefix: string | null;
  email: string | null;
  isNew: boolean;
  onSubmit: (formData: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    prefix: string;
    birthdate: string;
    gender: string;
    numberDocument: string;
    documentTypeId: string;
    new: boolean;
  }) => void;
  initialData?: any;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  message,
  phone,
  prefix,
  email,
  isNew,
  onSubmit,
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const formattedPrefix = prefix?.startsWith("+") ? prefix : `+${prefix}`;
  const { documentTypes } = useDocumentTypes();

  const initialValues = {
    name: initialData?.name || "",
    lastName: initialData?.lastName || "",
    email: email || "",
    phone: phone || "",
    prefix: formattedPrefix || "",
    birthdate: initialData?.birthdate || new Date().toISOString().split("T")[0],
    gender: initialData?.gender || "",
    numberDocument: initialData?.document_id || "",
    documentTypeId: initialData?.document_type_id || "",
    new: isNew,
  };

  const options = documentTypes.map((documentType) => ({
    label: documentType.name,
    value: documentType.id,
  }));

  const genderOptions = [
    { label: "Femenino", value: "femenino" },
    { label: "Masculino", value: "masculino" },
    { label: "Otro", value: "otro" },
  ];

  return (
    <div className="flex w-full flex-col items-start justify-center gap-6">
      <Formik
        initialValues={initialValues}
        validationSchema={profileValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log("🔍 Values:", values);
          setLoading(true);
          onSubmit(values);
          setSubmitting(false);
          setLoading(false);
        }}
        enableReinitialize
      >
        {({ setFieldValue, values, errors, touched, isValid, dirty }) => (
          <Form className="w-full flex flex-col gap-4">
            <FormInput
              label="Nombre"
              name="name"
              placeholder="Nombre completo"
            />
            <FormInput
              label="Apellidos"
              name="lastName"
              placeholder="Apellido completo"
            />

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="birthdate">Fecha de nacimiento</Label>
              <CustomDatePicker
                value={
                  values.birthdate &&
                  !isNaN(new Date(values.birthdate).getTime())
                    ? new Date(values.birthdate)
                    : null
                }
                onChange={(date) =>
                  setFieldValue(
                    "birthdate",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
              />
              <ErrorMessage
                name="birthdate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <FormInput
              label="Correo"
              name="email"
              placeholder="Email: ejemplo@gmail.com"
              disabled={!isNew}
            />

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="phone">Celular</Label>
              <PhoneInput
                className="w-full"
                value={!isNew ? formattedPrefix + phone : ""}
                onChange={(value) => setFieldValue("phone", value)}
                defaultCountry="CO"
                placeholder="Ingresa tu número de celular"
                disabled={!isNew}
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <FormSelect
              label="Tipo de documento"
              name="documentTypeId"
              options={options}
              helpText="Este información es privada."
              disabled={!isNew}
              defaultValue={initialData?.document_type_id || "none"}
            />
            <FormInput
              label="Número de documento"
              name="numberDocument"
              placeholder="Número de documento"
              disabled={!isNew}
            />

            <FormSelect label="Genero" name="gender" options={genderOptions} />

            {message && (
              <div className="mt-10">
                <div className="flex w-full items-start gap-4">
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                    <span className="text-body font-body text-default-font">
                      {message}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              className="h-10 w-full flex-none"
              variant="brand-tertiary"
              size="large"
              iconRight="FeatherSave"
              loading={loading}
              type="submit"
              disabled={!isValid || !dirty}
            >
              {isNew ? "Crear cuenta" : "Actualizar datos"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileForm;
