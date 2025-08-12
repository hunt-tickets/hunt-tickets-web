import { useAddCategoryToProducer } from "@/hook/useAddCategoryToProducer";
import { useProducerCategories } from "@/hook/useProducerCategories";
import { ProducerCategoryOrder } from "@/types/site";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormSelect from "../site/FormSelect";
import { Button } from "../sub/button";

type ProfileCategoryProps = {
  producerId: string;
  onCategoryAdded: (category: ProducerCategoryOrder) => void;
};

const profileCategoryValidationSchema = Yup.object().shape({
  category: Yup.string()
    .required("Debe seleccionar una opción")
    .notOneOf(["", "undefined", "null"], "Debe seleccionar una opción válida"),
});

const ProfileCategory = ({
  producerId,
  onCategoryAdded,
}: ProfileCategoryProps) => {
  const { categories, loading } = useProducerCategories();
  const { addCategory, loading: addCategoryLoading } =
    useAddCategoryToProducer();

  const initialValues = {
    category: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: any
  ) => {
    const { category } = values;
    const response = await addCategory(producerId, category);

    if (response?.category) {
      console.log("Error adding category to producer:", response.category);
      onCategoryAdded(response.category);
      resetForm();
    }
  };

  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <Formik
        initialValues={initialValues}
        validationSchema={profileCategoryValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex w-full flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-4 py-4 shadow-sm">
              <div className="flex w-full items-end justify-end gap-2">
                <FormSelect
                  label="Agregar una nueva categoría"
                  name="category"
                  options={options}
                />
                <Button
                  disabled={isSubmitting || addCategoryLoading}
                  variant="neutral-primary"
                  size="medium"
                  icon={null}
                  iconRight="FeatherPlus"
                  loading={addCategoryLoading}
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

export default ProfileCategory;
