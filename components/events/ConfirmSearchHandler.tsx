"use client";

import { useUpdateTransactionStatus } from "@/hook/useUpdateTransactionStatus";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Failed from "./status/Failed";
import Rejected from "./status/Rejected";
import Success from "./status/Success";

const ConfirmSearchHandler = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("bold-order-id");
  const txStatus = searchParams.get("bold-tx-status");
  const { updateStatus, loading, success, error } =
    useUpdateTransactionStatus();
  const [finalStatus, setFinalStatus] = useState<
    "success" | "rejected" | "failed" | null
  >(null);

  useEffect(() => {
    if (orderId && txStatus) {
      let status = "";

      switch (txStatus.toLowerCase()) {
        case "approved":
          status = "APPROVED_BY_PAYMENT_GATEWAY";
          setFinalStatus("success");
          break;
        case "rejected":
          status = "REJECTED_BY_PAYMENT_GATEWAY";
          setFinalStatus("rejected");
          break;
        case "failed":
        default:
          status = "FAILED";
          setFinalStatus("failed");
      }

      updateStatus(orderId, status);
    }
  }, [orderId, txStatus]);

  if (loading) {
    return <p className="text-lg text-center">Procesando confirmación...</p>;
  }

  if (error) {
    return <Failed />;
  }

  if (finalStatus === "success") return <Success />;
  if (finalStatus === "rejected") return <Rejected />;
  if (finalStatus === "failed") return <Failed />;

  return null;
};

export default ConfirmSearchHandler;
