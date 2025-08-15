import { supabase } from "@/lib/supabaseBrowser";

export interface Transaction {
  id: string;
  order_id: string;
  created_at: string;
  status: string;
  source: string;
  total: number;
  price: number;
  variable_fee: number;
  tax: number;
  quantity: number;
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_phone: string;
  ticket_name: string;
  promoter_name: string | null;
  promoter_lastname: string | null;
  promoter_email: string | null;
  promoter_phone: string | null;
  has_promoter: boolean;
}

export interface TransactionsResponse {
  data: Transaction[];
  is_admin: boolean;
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export async function getEventTransactions(
  eventId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<TransactionsResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_event_transactions_list_web_v1`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        p_event_id: eventId,
        p_page: page,
        p_page_size: pageSize
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Transactions API error! status: ${response.status}, body: ${errorText}`);
    throw new Error(`Error al cargar transacciones: HTTP ${response.status}`);
  }

  const result = await response.json();
  return result;
}