import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Button } from "../sub/button";
import FormInput from "./FormInput";

const emailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Por favor, ingresa un correo válido")
    .required("El correo es obligatorio"),
});

const EmailLoginForm = ({
  onSubmit,
  initialEmail = "",
  loading,
}: {
  onSubmit: (values: { email: string }) => void;
  initialEmail?: string;
  loading: boolean;
}) => {
  return (
    <Formik
      initialValues={{ email: initialEmail }}
      validationSchema={emailValidationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {() => (
        <Form className="space-y-4">
          <FormInput
            label="Correo"
            name="email"
            placeholder="Email: ejemplo@gmail.com"
          />
          <Button
            className="h-10 w-full flex-none"
            size="large"
            icon={null}
            iconRight="FeatherArrowRight"
            loading={loading}
            type="submit"
          >
            Continuar
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EmailLoginForm;
