"use client";
import { useEffect, useState } from "react";
import { Button } from "../sub/button";
import { InputOTPCode } from "./InputOTPCode";

interface VerificationCodeProps {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({
  verificationCode,
  setVerificationCode,
  onSubmit,
  onResend,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(true);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDisabled && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      setIsDisabled(false);
    }
    return () => clearInterval(timer);
  }, [isDisabled, timeLeft]);

  useEffect(() => {
    const isValid = /^\d{6}$/.test(verificationCode);
    setIsVerifyDisabled(!isValid);
  }, [verificationCode]);

  const handleResend = () => {
    if (!isDisabled) {
      onResend();
      setIsDisabled(true);
      setTimeLeft(20);
    }
  };

  return (
    <div className="flex w-full max-w-[550px] flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex w-full items-center gap-2">
          <InputOTPCode
            value={verificationCode}
            onChange={(e) => setVerificationCode(e)}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col w-72 items-center justify-center gap-6">
        <Button
          className="h-8 w-full flex-none"
          onClick={onSubmit}
          disabled={isVerifyDisabled}
        >
          Verificar
        </Button>
  
        <Button
          variant="brand-tertiary"
          className="h-8 w-[%] flex-none"
          onClick={handleResend}
          disabled={isDisabled}
        >
          {isDisabled ? `Reenviar en ${timeLeft}s` : "Reenviar código"}
        </Button>
      </div>
    </div>
  );
};

export default VerificationCode;
