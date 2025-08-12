import { PhoneInput } from "@/components/site/PhoneInput";
import { ErrorMessage, Form, Formik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { Button } from "../sub/button";

const phoneValidationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(
      /^\+57\d{10}$/,
      "Número de celular inválido. Debe incluir el prefijo +57."
    )
    .required("El número de celular es obligatorio"),
});

const PhoneLoginForm = ({
  onSubmit,
  value,
  onChange,
}: {
  onSubmit: (values: { phoneNumber: string }) => void;
  value: string;
  onChange: (phone: string) => void;
}) => {
  return (
    <Formik
      initialValues={{ phoneNumber: value }}
      validationSchema={phoneValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              Celular
            </label>
            <PhoneInput
              className="w-full"
              value={value}
              onChange={(phone) => {
                setFieldValue("phoneNumber", phone);
                onChange(phone);
              }}
              defaultCountry="CO"
              placeholder="Ingresa tu número de celular"
            />
            <ErrorMessage
              name="phoneNumber"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <Button
            className="h-10 w-full flex-none"
            variant="neutral-primary"
            size="large"
            iconRight="FeatherArrowRight"
            type="submit"
          >
            Continuar
          </Button>
          <Link href={`sign-mail`}>
            <Button
              className="h-10 w-full flex-none"
              variant="brand-secondary"
              size="large"
              icon="FeatherMail"
            >
              Login con email
            </Button>
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default PhoneLoginForm;
