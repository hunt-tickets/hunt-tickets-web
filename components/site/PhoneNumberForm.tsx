import { Button } from "../ui/button";
import { PhoneInput } from "./PhoneInput";

interface PhoneNumberFormProps {
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  onSubmit,
}) => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-6">
      <div className="flex w-full flex-col items-start justify-center gap-2">
        <span className="text-body font-body text-default-font">
          Coloca tu número de teléfono
        </span>
        <div className="flex w-full">
          <PhoneInput
            className="w-full"
            onChange={setPhoneNumber}
            defaultCountry="CO"
            placeholder="Ingresa tu número de celular"
          />
        </div>
      </div>
      <Button
        className="h-10 w-full flex-none"
        onClick={() => console.log("click")}
      >
        Continuar
      </Button>
    </div>
  );
};

export default PhoneNumberForm;
