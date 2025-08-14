import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

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
  const { isKeyboardVisible, keyboardHeight } = useKeyboardHeight();
  
  return (
    <Formik
      initialValues={{ email: initialEmail }}
      validationSchema={emailValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit({ email: values.email.toLowerCase() });
        setSubmitting(false);
      }}
    >
      {() => (
        <div 
          className="relative w-full"
          style={{
            paddingBottom: isKeyboardVisible ? `${keyboardHeight + 20}px` : '0px',
            transition: 'padding-bottom 0.3s ease-in-out'
          }}
        >
          <Form className="space-y-4">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="ejemplo@gmail.com"
            />
            
            {/* Button in normal position when keyboard is hidden */}
            {!isKeyboardVisible && (
              <Button
                className="h-12 w-full flex-none text-white"
                variant="neutral-secondary"
                size="large"
                icon={null}
                iconRight="FeatherArrowRight"
                loading={loading}
                type="submit"
              >
                Continuar
              </Button>
            )}
          </Form>
          
          {/* Fixed button only when keyboard is visible */}
          {isKeyboardVisible && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-white/10 z-50 transition-all duration-300">
              <Button
                className="h-12 w-full flex-none text-white"
                variant="neutral-secondary"
                size="large"
                icon={null}
                iconRight="FeatherArrowRight"
                loading={loading}
                type="submit"
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    form.requestSubmit();
                  }
                }}
              >
                Continuar
              </Button>
            </div>
          )}
        </div>
      )}
    </Formik>
  );
};

export default EmailLoginForm;
