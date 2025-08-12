import { useEffect, useRef } from "react";

export const useBoldCheckout = ({
  amount,
  description,
  customerData,
  orderId,
}: {
  amount: number;
  description: string;
  customerData: {
    email: string;
    fullName: string;
    phone: string;
    dialCode: string;
    documentNumber: string;
    documentType: string;
  };
  orderId: string;
}) => {
  const checkoutRef = useRef<any>(null);

  useEffect(() => {
    const loadBoldScript = () => {
      if (
        document.querySelector(
          'script[src="https://checkout.bold.co/library/boldPaymentButton.js"]'
        )
      )
        return;

      const script = document.createElement("script");
      script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
      script.onload = () =>
        window.dispatchEvent(new Event("boldCheckoutLoaded"));
      document.head.appendChild(script);
    };

    loadBoldScript();

    const handleClick = async () => {
      if (!window.BoldCheckout) {
        console.log("BoldCheckout no está cargado.");
        return;
      }

      const currency = "COP";

      const fetchHash = async () => {
        const response = await fetch("/api/hash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount, currency }),
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el hash de integridad");
        }

        const data = await response.json();
        return data.hash;
      };

      try {
        const hash = await fetchHash();

        const config = {
          orderId,
          currency,
          amount: amount.toString(),
          apiKey: process.env.NEXT_PUBLIC_BOLD_API_KEY || "",
          integritySignature: hash, // ✅ Aquí ya no está undefined
          description,
          renderMode: "embedded",
          originUrl: window.location.href,
          redirectionUrl: `${window.location.origin}/events/confirm`,
          expirationDate: (Date.now() + 10 * 60 * 1000) * 1_000_000,
          customerData: JSON.stringify(customerData),
        };


        const checkout = new window.BoldCheckout(config);
        checkoutRef.current = checkout;
        checkout.open();
      } catch (error) {
        console.log("❌ Error al crear instancia BoldCheckout:", error);
      }
    };

    const button = document.querySelector("[data-bold-payment-button]");
    if (button) {
      button.addEventListener("click", handleClick);
    }

    return () => {
      if (button) button.removeEventListener("click", handleClick);
    };
  }, [amount, description, customerData]);

  return {
    open: () => checkoutRef.current?.open(),
  };
};
