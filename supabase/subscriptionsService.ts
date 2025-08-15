import { supabase } from "@/lib/supabaseBrowser";

export interface Subscription {
  id: string;
  created_at: string;
  company: string;
  service: string;
  amount: number;
  currency: string;
  payment_method: string;
  receipt_name: string;
  url?: string;
  date: string;
}

export interface CreateSubscriptionData {
  company: string;
  service: string;
  amount: number;
  currency: string;
  payment_method: string;
  receipt_name: string;
  url?: string;
  date: string;
}

export interface UpdateSubscriptionData {
  company?: string;
  service?: string;
  amount?: number;
  currency?: string;
  payment_method?: string;
  receipt_name?: string;
  url?: string;
  date?: string;
}

// Get all subscriptions with optional filters
export const getSubscriptions = async (filters?: {
  company?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase
      .from('subscriptions')
      .select('*');

    // Apply filters
    if (filters?.company) {
      query = query.ilike('company', `%${filters.company}%`);
    }

    if (filters?.currency) {
      query = query.eq('currency', filters.currency);
    }

    if (filters?.dateFrom) {
      query = query.gte('date', filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte('date', filters.dateTo);
    }

    // Apply ordering
    if (filters?.orderBy) {
      query = query.order(filters.orderBy, { 
        ascending: filters.orderDirection === 'asc' 
      });
    } else {
      query = query.order('date', { ascending: false });
    }

    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data: data as Subscription[], error: null };
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return { data: null, error };
  }
};

// Get subscription by ID
export const getSubscriptionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Subscription, error: null };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { data: null, error };
  }
};

// Create new subscription
export const createSubscription = async (subscriptionData: CreateSubscriptionData) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Subscription, error: null };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return { data: null, error };
  }
};

// Update subscription
export const updateSubscription = async (id: string, updateData: UpdateSubscriptionData) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data: data as Subscription, error: null };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { data: null, error };
  }
};

// Delete subscription
export const deleteSubscription = async (id: string) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return { error };
  }
};

// Search subscriptions across multiple fields
export const searchSubscriptions = async (searchTerm: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .or(`company.ilike.%${searchTerm}%,service.ilike.%${searchTerm}%,receipt_name.ilike.%${searchTerm}%,payment_method.ilike.%${searchTerm}%`)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return { data: data as Subscription[], error: null };
  } catch (error) {
    console.error('Error searching subscriptions:', error);
    return { data: null, error };
  }
};

// Get subscriptions by date range
export const getSubscriptionsByDateRange = async (startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return { data: data as Subscription[], error: null };
  } catch (error) {
    console.error('Error fetching subscriptions by date range:', error);
    return { data: null, error };
  }
};

// Get subscription stats
export const getSubscriptionStats = async () => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('amount, currency, date');

    if (error) {
      throw error;
    }

    // Calculate stats
    const totalSubscriptions = data.length;
    const totalAmountUSD = data
      .filter(sub => sub.currency === 'USD')
      .reduce((sum, sub) => sum + parseFloat(sub.amount.toString()), 0);
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const thisMonthSubscriptions = data.filter(sub => 
      sub.date.startsWith(currentMonth)
    );
    const thisMonthAmount = thisMonthSubscriptions
      .filter(sub => sub.currency === 'USD')
      .reduce((sum, sub) => sum + parseFloat(sub.amount.toString()), 0);

    const averageAmount = totalSubscriptions > 0 ? totalAmountUSD / totalSubscriptions : 0;

    return {
      data: {
        totalSubscriptions,
        totalAmountUSD,
        thisMonthAmount,
        thisMonthSubscriptions: thisMonthSubscriptions.length,
        averageAmount
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching subscription stats:', error);
    return { data: null, error };
  }
};