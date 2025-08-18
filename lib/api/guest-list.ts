import { supabase } from "@/lib/supabaseBrowser";

export interface GuestListUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  birthdate?: string;
  gender?: string;
}

export interface GuestListAssets {
  qr_url?: string;
  png_url?: string;
  pdf_url?: string;
  wallet_url?: string;
}

export interface GuestListItem {
  id: string;
  user: GuestListUser;
  status: 'active' | 'scanned' | 'late_fee_pending' | 'late_fee_paid';
  created_at: string;
  email_sent: boolean;
  scan: boolean;
  scanner_id?: string;
  scanned_at?: string;
  late_fee_status?: string;
  late_fee_total?: number;
  late_fee_price?: number;
  late_fee_tax?: number;
  late_fee_variable_fee?: number;
  late_fee_payment_link?: string;
  late_fee_sent_at?: string;
  confirmation_sent_at?: string;
  assets: GuestListAssets;
}

export interface GuestListResponse {
  data: GuestListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GuestListKPIs {
  invitations: number;
  redeemed: number;
  revenue: number;
}

export async function getEventGuestList(
  eventId: string,
  page: number = 1,
  limit: number = 50,
  status: string = 'all',
  search?: string,
  dateFrom?: string,
  dateTo?: string,
  sort: string = 'created_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<GuestListResponse> {
  try {
    // Start building the query - get all fields to see what's available
    let query = supabase
      .from('guest_list')
      .select(`
        *,
        users:user_id (
          *
        )
      `)
      .eq('event_id', eventId);

    // Apply status filter
    if (status !== 'all') {
      if (status === 'scanned') {
        query = query.eq('scan', true);
      } else if (status === 'active') {
        query = query.eq('scan', false);
      } else {
        query = query.eq('late_fee_status', status);
      }
    }

    // Apply search filter
    if (search) {
      query = query.or(`users.name.ilike.%${search}%,users.email.ilike.%${search}%`);
    }

    // Apply date filters
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching guest list: ${error.message}`);
    }

    // Transform data to match our interface
    const transformedData: GuestListItem[] = (data || []).map((item: any) => {
      
      // Full name construction
      const fullName = item.users ? 
        `${item.users.name || ''} ${item.users.lastName || ''}`.trim() || 'Usuario Desconocido'
        : 'Usuario Desconocido';
      
      // Phone with prefix
      const fullPhone = item.users?.prefix && item.users?.phone ? 
        `+${item.users.prefix} ${item.users.phone}` : 
        item.users?.phone;
      
      // Determine status based on multiple factors
      let status: 'active' | 'scanned' | 'late_fee_pending' | 'late_fee_paid' = 'active';
      if (item.scan) {
        status = 'scanned';
      } else if (item.late_fee_status === 'pending') {
        status = 'late_fee_pending';
      } else if (item.late_fee_status === 'PAID' || item.late_fee_status === 'PAID WITH QR') {
        status = 'late_fee_paid';
      }
      
      return {
        id: item.id,
        user: {
          id: item.users?.id || item.user_id,
          name: fullName,
          email: item.users?.email || '',
          phone: fullPhone,
          document: item.users?.document_id,
          birthdate: item.users?.birthdate,
          gender: item.users?.gender
        },
        status: status,
        created_at: item.created_at,
        email_sent: item.email_sent || false,
        scan: item.scan || false,
        scanner_id: item.scanner_id,
        scanned_at: item.scanned_at,
        late_fee_status: item.late_fee_status,
        late_fee_total: item.late_fee_total,
        late_fee_price: item.late_fee_price,
        late_fee_tax: item.late_fee_tax,
        late_fee_variable_fee: item.late_fee_variable_fee,
        late_fee_payment_link: item.late_fee_payment_link,
        late_fee_sent_at: item.late_fee_sent_at,
        confirmation_sent_at: item.confirmation_sent_at,
        assets: {
          qr_url: item.svg,
          png_url: item.png_url,
          pdf_url: item.pdf_url,
          wallet_url: item.apple_wallet_url
        }
      };
    });

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('guest_list')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    return {
      data: transformedData,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        pages: Math.ceil((totalCount || 0) / limit)
      }
    };

  } catch (error) {
    console.error('Error fetching guest list:', error);
    // Return empty data on error instead of throwing
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0
      }
    };
  }
}

export async function getGuestListKPIs(eventId: string): Promise<GuestListKPIs> {
  try {
    // Get total invitations count
    const { count: totalInvitations } = await supabase
      .from('guest_list')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    // Get redeemed (scanned) count
    const { count: redeemedCount } = await supabase
      .from('guest_list')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('scan', true);

    // For revenue, only count late fees that are PAID or PAID WITH QR
    const { data: revenueData } = await supabase
      .from('guest_list')
      .select('late_fee_total, late_fee_status')
      .eq('event_id', eventId)
      .not('late_fee_total', 'is', null)
      .or('late_fee_status.eq.PAID,late_fee_status.eq.PAID WITH QR');

    const revenue = revenueData?.reduce((sum, item) => sum + (item.late_fee_total || 0), 0) || 0;

    return {
      invitations: totalInvitations || 0,
      redeemed: redeemedCount || 0,
      revenue: revenue,
    };

  } catch (error) {
    console.error('Error fetching guest list KPIs:', error);
    // Return zeros on error
    return {
      invitations: 0,
      redeemed: 0,
      revenue: 0,
    };
  }
}

export async function createGuestListInvitation(
  eventId: string,
  userData: {
    name: string;
    email: string;
    phone?: string;
  }
): Promise<GuestListItem> {
  try {
    // First, create or find the user
    let user;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name, email, phone')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      user = existingUser;
    } else {
      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        })
        .select()
        .single();

      if (userError) {
        throw new Error(`Error creating user: ${userError.message}`);
      }
      user = newUser;
    }

    // Create guest list entry
    const { data: guestListEntry, error: guestListError } = await supabase
      .from('guest_list')
      .insert({
        event_id: eventId,
        user_id: user.id,
        email_sent: false,
        scan: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (guestListError) {
      throw new Error(`Error creating guest list entry: ${guestListError.message}`);
    }

    // Return the created invitation
    return {
      id: guestListEntry.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      status: "active",
      created_at: guestListEntry.created_at,
      email_sent: false,
      scan: false,
      assets: {
        qr_url: guestListEntry.svg,
        pdf_url: guestListEntry.pdf_url,
        wallet_url: guestListEntry.apple_wallet_url
      }
    };

  } catch (error) {
    console.error('Error creating guest list invitation:', error);
    throw error;
  }
}

export async function deleteGuestListInvitation(
  eventId: string,
  guestListId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('guest_list')
      .delete()
      .eq('id', guestListId)
      .eq('event_id', eventId); // Additional security check

    if (error) {
      throw new Error(`Error deleting guest list invitation: ${error.message}`);
    }

  } catch (error) {
    console.error('Error deleting guest list invitation:', error);
    throw error;
  }
}