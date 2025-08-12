import { Input as InputUI } from "@/components/ui/input";
import { Label } from "../ui/label";

type InputProps = {
  title: string;
  placeholder: string;
  info: string;
};

const Input = ({ title, placeholder, info }: InputProps) => {
  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
        <Label>{title}</Label>
        <InputUI placeholder={placeholder} />
        <p className="text-body font-body text-default-font">{info}</p>
      </div>
    </div>
  );
};

export default Input;
