import { Input } from "@/components/ui/input";
import { ErrorMessage, Field } from "formik";
import { HelpText } from "./HelpText";
import { Label } from "../ui/label";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  helpText = "",
  disabled = false,
}) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Field
        as={Input}
        className="w-full"
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
      {helpText && <HelpText>{helpText}</HelpText>}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default FormInput;
