import { Input } from "@/components/ui/input";
import { ErrorMessage, Field } from "formik";
import { HelpText } from "./HelpText";
import { Label } from "../ui/label";
import EmailInputWithSuggestions from "./EmailInputWithSuggestions";

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
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={name} className="text-base font-medium">{label}</Label>
      {type === "email" ? (
        <EmailInputWithSuggestions
          name={name}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <Field
          as={Input}
          className="w-full"
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      {helpText && <HelpText>{helpText}</HelpText>}
      <ErrorMessage
        name={name}
        component="div"
        className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-sm"
      />
    </div>
  );
};

export default FormInput;
