import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormSelect from "../site/FormSelect";
import { Button } from "../sub/button";

type ProfileVenuesProps = {
  close: () => void;
};

const profileVenuesValidationSchema = Yup.object().shape({
  category: Yup.string()
    .required("Debe seleccionar una opción")
    .notOneOf(["", "undefined", "null"], "Debe seleccionar una opción válida"),
});

const options = [
  { value: "todos", label: "Todos" },
  { value: "tycho", label: "Tycho" },
  { value: "la_casa_de_la_musica", label: "La Casa de la Música" },
  { value: "four_test", label: "Four Test" },
];

const ProfileVenues = ({ close }: ProfileVenuesProps) => {
  const initialValues = {
    category: "",
  };
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Formik
        initialValues={{ category: "" }}
        validationSchema={profileVenuesValidationSchema}
        onSubmit={(values) => {
          console.log("Formulario enviado con:", values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-end justify-end gap-2">
                <FormSelect
                  label="Agregar un nuevo venue"
                  name="venues"
                  options={options}
                />
                <Button
                  disabled={isSubmitting}
                  variant="neutral-primary"
                  size="medium"
                  icon={null}
                  iconRight="FeatherPlus"
                  loading={false}
                  type="submit"
                  className="h-[42px]"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileVenues;
