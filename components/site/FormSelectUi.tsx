import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage, Field } from "formik";
import { HelpText } from "./HelpText";

interface Option {
  value: string;
  label: string;
}

interface FormSelectUiProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  helpText?: string;
}

const FormSelectUi: React.FC<FormSelectUiProps> = ({
  label,
  name,
  options,
  placeholder = "Seleccione una opción",
  helpText = "",
}) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={name}>{label}</label>
      <Field name={name}>
        {({ field, form }: any) => (
          <Select
            onValueChange={(value) => form.setFieldValue(name, value)}
            defaultValue={field.value || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>
      {helpText && <HelpText>{helpText}</HelpText>}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default FormSelectUi;
