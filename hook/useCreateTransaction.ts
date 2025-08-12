import { createTransactionWeb } from "@/supabase/producersService";

export const useCreateTransaction = () => {
  const createTransaction = async (data: {
    p_order: string;
    p_user_id: string;
    p_ticket_id: string;
    p_price: number;
    p_variable_fee: number;
    p_tax: number;
    p_quantity: number;
    p_total: number;
    p_seller_uid: string | null;
  }) => {
    try {
      const result = await createTransactionWeb(data);
      return result;
    } catch (error) {
      console.log("Error creando transacción:", error);
      return null;
    }
  };

  return { createTransaction };
};
