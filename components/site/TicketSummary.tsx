import React, { useState } from "react";
import { Button } from "../sub/button";
import { Checkbox } from "../sub/Checkbox";
export interface Ticket {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
  count: number;
}
interface TicketSummaryProps {
  tickets: Ticket[];
  onConfirm: (total: number) => void;
}

const TicketSummary: React.FC<TicketSummaryProps> = ({
  tickets,
  onConfirm,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const total = tickets.reduce(
    (sum, ticket) => sum + ticket.count * ticket.price,
    0
  );

  if (total === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6 border-t border-white/10 pt-6">
      {/* Terms checkbox */}
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          checked={acceptedTerms}
          onCheckedChange={setAcceptedTerms}
        />
        <span className="text-xs text-white/60">
          Acepto{" "}
          <a href="/resources/terms-and-conditions" target="_blank" className="underline hover:text-white/80">
            términos
          </a>{" "}
          y{" "}
          <a href="/resources/privacy" target="_blank" className="underline hover:text-white/80">
            privacidad
          </a>
        </span>
      </div>
      
      {/* Payment section */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/70 text-sm">Total a pagar</span>
          <span className="text-white font-bold text-xl">
            ${total.toLocaleString("es-CO")}
          </span>
        </div>
        
        <Button
          disabled={!acceptedTerms || total === 0}
          variant="brand-primary"
          size="large"
          onClick={() => onConfirm(total)}
          className="w-full"
        >
          {acceptedTerms ? 'Continuar con el pago' : 'Acepta los términos'}
        </Button>
      </div>
    </div>
  );
};

export default TicketSummary;
