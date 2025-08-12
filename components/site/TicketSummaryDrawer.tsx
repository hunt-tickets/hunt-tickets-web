import BaseDrawer from "@/components/site/BaseDrawer";
import { Button } from "@/components/sub/button";
import { useBoldCheckout } from "@/hook/useBoldCheckout";
import { useCreateTransaction } from "@/hook/useCreateTransaction";
import { useVariableFee } from "@/hook/useVariableFee";
import { useState, useEffect, useRef } from "react";

interface TicketSummaryDrawerProps {
  user: any;
  open: boolean;
  close: () => void;
  tickets: { title: string; count: number; price: number; id: string }[];
  total: number;
  onConfirm: () => void;
  eventId: string;
  sellerUid: string;
}

const TicketSummaryDrawer: React.FC<TicketSummaryDrawerProps> = ({
  user,
  open,
  close,
  tickets,
  total,
  onConfirm,
  eventId,
  sellerUid,
}) => {
  const { fee, loading: feeLoading, error: feeError } = useVariableFee(eventId);
  const { createTransaction } = useCreateTransaction();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const checkoutRef = useRef<any>(null);
  
  const serviceFee = total * (fee ?? 0.16);
  const iva = serviceFee * 0.19;
  const finalTotal = Math.ceil(total + serviceFee + iva);

  const getDocumentType = (id: string): string => {
    switch (id) {
      case "6e4f3991-6485-4c18-8984-68524176b6c9":
        return "CC";
      case "20d5a746-8eca-46a4-8f78-80f73f7b216e":
        return "PP";
      case "6e016b3b-5696-4480-b554-0a8519e4293b":
        return "CE";
      case "84b5bc42-7642-4bf7-8855-65270048c189":
        return "NIT";
      case "c51c1ce0-aa61-4400-b31a-ffd127339d4f":
        return "TI";
      default:
        return "CC";
    }
  };

  const dialCode = user?.phone?.startsWith("57") ? "+57" : "";
  const phone = user?.phone?.replace(/^57/, "") || "0000000000";
  const documentType = getDocumentType(user?.document_type_id);

  const orderId = `ORDER-${user?.id}-${Date.now()}`;

  const { open: openBoldCheckout } = useBoldCheckout({
    amount: finalTotal,
    description: "Compra de entradas",
    customerData: {
      email: user?.email,
      fullName: `${user?.name} ${user?.lastName}`,
      phone,
      dialCode,
      documentNumber: user?.document_id || "12345678",
      documentType,
    },
    orderId,
  });

  // Función para cerrar Bold manualmente
  const closeBoldCheckout = () => {
    try {
      // Buscar y cerrar cualquier iframe o modal de Bold
      const boldIframe = document.querySelector('iframe[src*="bold.co"]');
      if (boldIframe) {
        boldIframe.remove();
      }
      
      // Buscar overlay o contenedor modal
      const boldOverlay = document.querySelector('[class*="bold-checkout"], [id*="bold-checkout"]');
      if (boldOverlay) {
        boldOverlay.remove();
      }
      
      // También intentar con el checkoutRef si está disponible
      if (checkoutRef.current?.close) {
        checkoutRef.current.close();
      }
    } catch (err) {
      console.log("Error cerrando Bold:", err);
    }
  };

  const handleClick = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Primero crear todas las transacciones
      for (const ticket of tickets.filter((t) => t.count > 0)) {
        const transactionData = {
          p_order: orderId,
          p_user_id: user.id,
          p_seller_uid: sellerUid || null, // Manejar caso cuando no hay sellerUid
          p_ticket_id: ticket.id,
          p_price: ticket.price,
          p_variable_fee: fee ? ticket.price * fee : ticket.price * 0.16,
          p_tax: (fee ? ticket.price * fee : ticket.price * 0.16) * 0.19,
          p_quantity: ticket.count,
          p_total: finalTotal,
        };

        console.log('🔍 [TicketSummaryDrawer] Datos de transacción para entrada general:', {
          ticket: {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            count: ticket.count
          },
          transactionData,
          user: { id: user.id, email: user.email },
          sellerUid: {
            original: sellerUid,
            processed: sellerUid || null,
            isUndefined: sellerUid === undefined,
            isEmpty: !sellerUid
          },
          fee
        });

        const response = await createTransaction(transactionData);
        
        if (!response || response === null || (Array.isArray(response) && response.length === 0)) {
          throw new Error('La transacción no se pudo crear correctamente');
        }

        if (typeof response === 'object' && 'error' in response) {
          throw new Error(response.error || 'Error al crear la transacción');
        }
      }

      // Solo si todas las transacciones fueron exitosas
      console.log('Todas las transacciones creadas exitosamente');
      onConfirm();
      openBoldCheckout();
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`No se pudo procesar tu solicitud: ${errorMessage}. Por favor intenta nuevamente.`);
      
      // Intentar cerrar Bold si se abrió
      setTimeout(() => {
        closeBoldCheckout();
      }, 100);
    } finally {
      setIsProcessing(false);
    }
  };

  // Listener para detectar si Bold se abre sin transacciones válidas
  useEffect(() => {
    const checkForUnauthorizedBold = () => {
      const boldElement = document.querySelector('iframe[src*="bold.co"], [class*="bold-checkout"]');
      if (boldElement && error) {
        closeBoldCheckout();
      }
    };

    const interval = setInterval(checkForUnauthorizedBold, 500);
    return () => clearInterval(interval);
  }, [error]);

  return (
    <BaseDrawer open={open} close={close} title="Resumen de la compra">
      <div className="w-full p-6 flex flex-col gap-4">
        <h2 className="text-heading-2 font-heading-2 text-default-font">
          Detalles del pedido
        </h2>

        <div className="flex flex-col gap-3">
          {tickets.map(
            (ticket, index) =>
              ticket.count > 0 && (
                <div key={index} className="flex justify-between">
                  <span className="text-body font-body text-default-font">
                    {ticket.count}x {ticket.title}
                  </span>
                  <span className="text-body-bold font-body-bold text-default-font">
                    ${(ticket.count * ticket.price).toLocaleString("es-CO")}
                  </span>
                </div>
              )
          )}
        </div>

        <div className="border-t border-neutral-border pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-body text-default-font">
              Carrito de compra
            </span>
            <span className="text-body-bold text-default-font">
              ${total.toLocaleString("es-CO")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-body text-default-font">
              Tarifa de servicio
            </span>
            <span className="text-body-bold text-default-font">
              ${serviceFee.toLocaleString("es-CO")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-body text-default-font">IVA (19%)</span>
            <span className="text-body-bold text-default-font">
              ${iva.toLocaleString("es-CO")}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-neutral-border">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Total
            </span>
            <span className="text-heading-3 font-heading-3 text-brand-primary">
              ${finalTotal.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <p className="text-caption text-subtext-color text-center mt-2">
          Al presionar pagar se generará un enlace de pago válido por 10
          minutos. Si expira, se deberá generar una nueva orden.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <Button
          className="w-full mt-4"
          variant="brand-primary"
          size="large"
          onClick={handleClick}
          disabled={feeLoading || isProcessing}
        >
          {isProcessing ? 'Procesando...' : 'Proceder al pago'}
        </Button>
      </div>
    </BaseDrawer>
  );
};

export default TicketSummaryDrawer;