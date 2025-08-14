"use client";
import { useEffect, useState } from "react";
import { Button } from "../sub/button";
import { InputOTPCode } from "./InputOTPCode";

interface VerificationCodeProps {
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  contactInfo?: string;
  isEmail?: boolean;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({
  verificationCode,
  setVerificationCode,
  onSubmit,
  onResend,
  contactInfo,
  isEmail = false,
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
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-white mb-4">Código de Verificación</h3>
          <p className="text-base text-white/80 leading-relaxed max-w-md">
            Hemos enviado un código de 6 dígitos a{" "}
            <span className="font-semibold text-white">{contactInfo}</span>
            {isEmail && (
              <>
                <br />
                <span className="text-sm text-white/70 mt-2 block">
                  Revisa tu bandeja de spam si no lo encuentras.
                </span>
              </>
            )}
          </p>
        </div>
        
        <div className="flex w-full items-center justify-center">
          <InputOTPCode
            value={verificationCode}
            onChange={(e) => setVerificationCode(e)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-col w-full max-w-sm items-center justify-center gap-4">
        <button
          className="w-full py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/15 hover:border-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSubmit}
          disabled={isVerifyDisabled}
        >
          Verificar Código
        </button>
  
        <button
          className="w-full py-3 rounded-2xl bg-transparent border border-white/10 backdrop-blur-sm text-white/80 font-medium hover:bg-white/5 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          onClick={handleResend}
          disabled={isDisabled}
        >
          {isDisabled ? `Reenviar código en ${timeLeft}s` : "Reenviar código"}
        </button>
      </div>
    </div>
  );
};

export default VerificationCode;
