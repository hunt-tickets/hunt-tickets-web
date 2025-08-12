import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormSelect from "../site/FormSelect";
import { Button } from "../sub/button";

type ProfileResidentsProps = {
  close: () => void;
};

const profileResidentsValidationSchema = Yup.object().shape({
  category: Yup.string()
    .required("Debe seleccionar una opción")
    .notOneOf(["", "undefined", "null"], "Debe seleccionar una opción válida"),
});

const options = [
  { value: "todos", label: "Todos" },
  { value: "calamaro", label: "Calamaro" },
  { value: "dj", label: "Dj" },
  { value: "totola_monpoz", label: "Totola Monpoz" },
  { value: "dj_juan_king", label: "Dj Juan King" },
];

const ProfileResidents = ({ close }: ProfileResidentsProps) => {
  const initialValues = {
    category: "",
  };
  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
  };
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Formik
        initialValues={{ category: "" }}
        validationSchema={profileResidentsValidationSchema}
        onSubmit={(values) => {
          console.log("Formulario enviado con:", values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-end justify-end gap-2">
                <FormSelect
                  label="Agregar un nuevo residente"
                  name="residents"
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

export default ProfileResidents;
