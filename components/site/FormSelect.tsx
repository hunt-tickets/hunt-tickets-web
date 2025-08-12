import { ErrorMessage, Field } from "formik";
import { Select } from "../sub/select";
import { HelpText } from "./HelpText";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  helpText?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  defaultValue?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  placeholder = "Seleccione una opción",
  helpText = "",
  size = "md",
  disabled = false,
  defaultValue = "none",
}) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <Field name={name}>
        {({ field, form }: any) => (
          <Select
            {...field}
            value={field.value || undefined}
            defaultValue={defaultValue}
            onValueChange={(value: string) => {
              form.setFieldValue(name, value);
            }}
            size={size}
            error={!!form.errors[name] && form.touched[name]}
            disabled={disabled}
          >
            <Select.Item value="none" disabled>
              {placeholder}
            </Select.Item>
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
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

export default FormSelect;
