import { useDocumentTypes } from "@/hook/useDocumentTypes";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "../sub/button";
import { Label } from "../ui/label";
import CustomDatePicker from "./CustomDatePicker";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { PhoneInput } from "./PhoneInput";

const registrationValidationSchema = Yup.object().shape({
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
});
interface RegistrationFormProps {
  message: string;
  phone: string | null;
  email: string | null;
  onSubmit: (formData: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthdate: string;
    gender: string;
  }) => void;
  initialData?: any;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  message,
  phone,
  email,
  onSubmit,
  initialData,
}) => {
  const formattedPhone = phone?.startsWith("+") ? phone : `+${phone}`;
  const {
    documentTypes,
    loading: loadingDocumentTypes,
    error: errorDocumentTypes,
  } = useDocumentTypes();

  const initialValues = {
    name: initialData?.name || "",
    lastName: initialData?.lastName || "",
    email: email || "",
    phone: formattedPhone || "",
    birthdate: initialData?.birthdate || new Date().toISOString().split("T")[0],
    gender: initialData?.gender || "",
    numberDocument: initialData?.document_id || "",
    documentTypeId: initialData?.documentTypeId || "",
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
        validationSchema={registrationValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ setFieldValue, values }) => (
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
                value={new Date(values.birthdate)}
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
              disabled={!!email}
            />

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="phone">Celular</Label>
              <PhoneInput
                className="w-full"
                value={formattedPhone}
                onChange={(value) => setFieldValue("phone", value)}
                defaultCountry="CO"
                placeholder="Ingresa tu número de celular"
                disabled={!!phone}
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
            />

            <FormInput
              label="Número de documento"
              name="numberDocument"
              placeholder="Número de documento"
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
              variant="neutral-primary"
              size="large"
              iconRight="FeatherSave"
              loading={false}
              type="submit"
            >
              Guradar
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;
