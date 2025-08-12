export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          description: string | null;
          email: string | null;
          id: string;
          name: string | null;
          phone: string | null;
        };
        Insert: {
          description?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          phone?: string | null;
        };
        Update: {
          description?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      artists_links: {
        Row: {
          artist_id: string;
          id: string;
          link: string;
          social_media_id: string;
        };
        Insert: {
          artist_id: string;
          id?: string;
          link: string;
          social_media_id: string;
        };
        Update: {
          artist_id?: string;
          id?: string;
          link?: string;
          social_media_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "artists_links_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: true;
            referencedRelation: "artists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_links_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: true;
            referencedRelation: "artists_summary";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "artists_links_social_media_id_fkey";
            columns: ["social_media_id"];
            isOneToOne: false;
            referencedRelation: "social_media";
            referencedColumns: ["id"];
          }
        ];
      };
      business_type: {
        Row: {
          country_id: string;
          id: string;
          name: string;
        };
        Insert: {
          country_id: string;
          id?: string;
          name: string;
        };
        Update: {
          country_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "business_type_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          }
        ];
      };
      chatbot_sent: {
        Row: {
          chatbot_template_id: string;
          chatbot_type_id: string;
          created_at: string;
          id: string;
          total_price: number;
          user_id: string;
        };
        Insert: {
          chatbot_template_id: string;
          chatbot_type_id: string;
          created_at?: string;
          id?: string;
          total_price: number;
          user_id: string;
        };
        Update: {
          chatbot_template_id?: string;
          chatbot_type_id?: string;
          created_at?: string;
          id?: string;
          total_price?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chatbot_sent_chatbot_template_id_fkey";
            columns: ["chatbot_template_id"];
            isOneToOne: false;
            referencedRelation: "chatbot_template";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chatbot_sent_chatbot_type_id_fkey";
            columns: ["chatbot_type_id"];
            isOneToOne: false;
            referencedRelation: "chatbot_type";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chatbot_sent_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profilesOLD";
            referencedColumns: ["id"];
          }
        ];
      };
      chatbot_support: {
        Row: {
          chatbot_support_template_id: string;
          created_at: string;
          id: string;
          support_output: string | null;
          user_id: string;
          user_input: string | null;
        };
        Insert: {
          chatbot_support_template_id: string;
          created_at?: string;
          id?: string;
          support_output?: string | null;
          user_id: string;
          user_input?: string | null;
        };
        Update: {
          chatbot_support_template_id?: string;
          created_at?: string;
          id?: string;
          support_output?: string | null;
          user_id?: string;
          user_input?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chatbot_support_chatbot_support_template_id_fkey";
            columns: ["chatbot_support_template_id"];
            isOneToOne: false;
            referencedRelation: "chatbot_support_templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chatbot_support_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profilesOLD";
            referencedColumns: ["id"];
          }
        ];
      };
      chatbot_support_templates: {
        Row: {
          id: string;
          message: string;
        };
        Insert: {
          id?: string;
          message: string;
        };
        Update: {
          id?: string;
          message?: string;
        };
        Relationships: [];
      };
      chatbot_template: {
        Row: {
          created_at: string;
          id: string;
          manychat_id: number | null;
          message: string | null;
          name: string;
          reason: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          manychat_id?: number | null;
          message?: string | null;
          name: string;
          reason?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          manychat_id?: number | null;
          message?: string | null;
          name?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      chatbot_type: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          price: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
          price?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          price?: number | null;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          city_name: string;
          country_id: string;
          id: string;
        };
        Insert: {
          city_name: string;
          country_id: string;
          id?: string;
        };
        Update: {
          city_name?: string;
          country_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          }
        ];
      };
      countries: {
        Row: {
          country_code: string | null;
          country_name: string;
          currency: string;
          id: string;
        };
        Insert: {
          country_code?: string | null;
          country_name: string;
          currency: string;
          id?: string;
        };
        Update: {
          country_code?: string | null;
          country_name?: string;
          currency?: string;
          id?: string;
        };
        Relationships: [];
      };
      document_types: {
        Row: {
          alegra_id: string | null;
          country_id: string;
          id: string;
          name: string;
        };
        Insert: {
          alegra_id?: string | null;
          country_id: string;
          id?: string;
          name: string;
        };
        Update: {
          alegra_id?: string | null;
          country_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_types_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          }
        ];
      };
      events_category: {
        Row: {
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name?: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      events_draft: {
        Row: {
          category: string;
          date: string;
          description: string;
          id: string;
          name: string;
          status: Database["public"]["Enums"]["events_status"];
          subcategories: string;
          venue_id: string;
        };
        Insert: {
          category: string;
          date: string;
          description: string;
          id?: string;
          name: string;
          status: Database["public"]["Enums"]["events_status"];
          subcategories: string;
          venue_id: string;
        };
        Update: {
          category?: string;
          date?: string;
          description?: string;
          id?: string;
          name?: string;
          status?: Database["public"]["Enums"]["events_status"];
          subcategories?: string;
          venue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_draft_category_fkey";
            columns: ["category"];
            isOneToOne: false;
            referencedRelation: "events_category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_draft_subcategories_fkey";
            columns: ["subcategories"];
            isOneToOne: false;
            referencedRelation: "events_subcategory";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_draft_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          }
        ];
      };
      events_producers: {
        Row: {
          created_at: string;
          id: string;
          producer_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          producer_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          producer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_producers_producer_id_fkey";
            columns: ["producer_id"];
            isOneToOne: false;
            referencedRelation: "producers";
            referencedColumns: ["id"];
          }
        ];
      };
      events_size: {
        Row: {
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      events_subcategory: {
        Row: {
          category_id: string;
          id: string;
          name: string;
        };
        Insert: {
          category_id: string;
          id?: string;
          name: string;
        };
        Update: {
          category_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_subcategory_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "events_category";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_deals: {
        Row: {
          created_at: string;
          fixed_rate: number;
          id: string;
          payment_gateway_id: string;
          payment_method: string;
          updated_at: string | null;
          variable_rate: number;
        };
        Insert: {
          created_at?: string;
          fixed_rate?: number;
          id?: string;
          payment_gateway_id: string;
          payment_method: string;
          updated_at?: string | null;
          variable_rate?: number;
        };
        Update: {
          created_at?: string;
          fixed_rate?: number;
          id?: string;
          payment_gateway_id?: string;
          payment_method?: string;
          updated_at?: string | null;
          variable_rate?: number;
        };
        Relationships: [
          {
            foreignKeyName: "payment_deals_payment_gateway_id_fkey";
            columns: ["payment_gateway_id"];
            isOneToOne: false;
            referencedRelation: "payment_gateway";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_deals_payment_method_fkey";
            columns: ["payment_method"];
            isOneToOne: false;
            referencedRelation: "payment_method";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_gateway: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          tax_deduction: boolean | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          tax_deduction?: boolean | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          tax_deduction?: boolean | null;
        };
        Relationships: [];
      };
      payment_method: {
        Row: {
          id: string;
          known_as: string[] | null;
          name: string;
        };
        Insert: {
          id?: string;
          known_as?: string[] | null;
          name: string;
        };
        Update: {
          id?: string;
          known_as?: string[] | null;
          name?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          action: string;
          description: string | null;
          id: string;
        };
        Insert: {
          action: string;
          description?: string | null;
          id?: string;
        };
        Update: {
          action?: string;
          description?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      producers: {
        Row: {
          created_at: string;
          description: string;
          email: string | null;
          id: string;
          name: string;
          phone: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          email?: string | null;
          id?: string;
          name: string;
          phone: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "producers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profilesOLD";
            referencedColumns: ["id"];
          }
        ];
      };
      producers_account: {
        Row: {
          account: number | null;
          document_type_id: string;
          id: string;
          producer_account_type_id: string;
          producer_bank_id: string;
          producer_id: string;
        };
        Insert: {
          account?: number | null;
          document_type_id: string;
          id?: string;
          producer_account_type_id: string;
          producer_bank_id: string;
          producer_id: string;
        };
        Update: {
          account?: number | null;
          document_type_id?: string;
          id?: string;
          producer_account_type_id?: string;
          producer_bank_id?: string;
          producer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "producers_account_document_type_id_fkey";
            columns: ["document_type_id"];
            isOneToOne: false;
            referencedRelation: "document_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "producers_account_producer_account_type_id_fkey";
            columns: ["producer_account_type_id"];
            isOneToOne: false;
            referencedRelation: "producers_account_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "producers_account_producer_bank_id_fkey";
            columns: ["producer_bank_id"];
            isOneToOne: false;
            referencedRelation: "producers_banks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "producers_account_producer_id_fkey";
            columns: ["producer_id"];
            isOneToOne: false;
            referencedRelation: "producers";
            referencedColumns: ["id"];
          }
        ];
      };
      producers_account_types: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      producers_banks: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          id: string;
          phone: string | null;
          updated_at: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      profilesOLD: {
        Row: {
          birthdate: string | null;
          createdat: string | null;
          email: string;
          gender: string | null;
          id: string;
          last_name: string | null;
          name: string;
          phone: string | null;
        };
        Insert: {
          birthdate?: string | null;
          createdat?: string | null;
          email: string;
          gender?: string | null;
          id?: string;
          last_name?: string | null;
          name: string;
          phone?: string | null;
        };
        Update: {
          birthdate?: string | null;
          createdat?: string | null;
          email?: string;
          gender?: string | null;
          id?: string;
          last_name?: string | null;
          name?: string;
          phone?: string | null;
        };
        Relationships: [];
      };
      role: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          created_at: string | null;
          id: string;
          permission_id: string | null;
          role_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          permission_id?: string | null;
          role_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          permission_id?: string | null;
          role_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "permissions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["id"];
          }
        ];
      };
      sellers: {
        Row: {
          id: string;
          producer_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          producer_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          producer_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sellers_producer_id_fkey";
            columns: ["producer_id"];
            isOneToOne: false;
            referencedRelation: "producers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sellers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profilesOLD";
            referencedColumns: ["id"];
          }
        ];
      };
      social_media: {
        Row: {
          id: string;
          name: string;
          social_media_type_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          social_media_type_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          social_media_type_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "social_media_social_media_type_id_fkey";
            columns: ["social_media_type_id"];
            isOneToOne: false;
            referencedRelation: "social_media_type";
            referencedColumns: ["id"];
          }
        ];
      };
      social_media_type: {
        Row: {
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tickets: {
        Row: {
          date: string | null;
          deadline: boolean;
          description: string;
          events_id: string;
          id: string;
          name: string;
          price: number;
          quantity: number;
          seller_allowed: boolean;
          seller_price: number;
          seller_service_price: number;
          seller_tax: number;
          service_price: number;
          special_price: boolean | null;
          tax: number;
          ticket_type_id: string;
          units: number;
        };
        Insert: {
          date?: string | null;
          deadline: boolean;
          description: string;
          events_id?: string;
          id?: string;
          name: string;
          price: number;
          quantity: number;
          seller_allowed?: boolean;
          seller_price?: number;
          seller_service_price?: number;
          seller_tax?: number;
          service_price: number;
          special_price?: boolean | null;
          tax: number;
          ticket_type_id: string;
          units?: number;
        };
        Update: {
          date?: string | null;
          deadline?: boolean;
          description?: string;
          events_id?: string;
          id?: string;
          name?: string;
          price?: number;
          quantity?: number;
          seller_allowed?: boolean;
          seller_price?: number;
          seller_service_price?: number;
          seller_tax?: number;
          service_price?: number;
          special_price?: boolean | null;
          tax?: number;
          ticket_type_id?: string;
          units?: number;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_ticket_type_id_fkey";
            columns: ["ticket_type_id"];
            isOneToOne: false;
            referencedRelation: "tickets_types";
            referencedColumns: ["id"];
          }
        ];
      };
      tickets_types: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      users_roles: {
        Row: {
          created_at: string | null;
          id: string;
          role_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_roles_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profilesOLD";
            referencedColumns: ["id"];
          }
        ];
      };
      venues: {
        Row: {
          address: string;
          city: string | null;
          country: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          address: string;
          city?: string | null;
          country?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          address?: string;
          city?: string | null;
          country?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "venues_city_fkey";
            columns: ["city"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "venues_country_fkey";
            columns: ["country"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["id"];
          }
        ];
      };
      venues_links: {
        Row: {
          id: string;
          links: string | null;
          social_media_id: string;
          venue_id: string;
        };
        Insert: {
          id?: string;
          links?: string | null;
          social_media_id: string;
          venue_id: string;
        };
        Update: {
          id?: string;
          links?: string | null;
          social_media_id?: string;
          venue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "venues_links_social_media_id_fkey";
            columns: ["social_media_id"];
            isOneToOne: false;
            referencedRelation: "social_media";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "venues_links_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      artists_summary: {
        Row: {
          id: string | null;
          name: string | null;
        };
        Insert: {
          id?: string | null;
          name?: string | null;
        };
        Update: {
          id?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      chatbot_download: {
        Args: {
          phone: string;
          id: string;
        };
        Returns: Json;
      };
      manychat_process: {
        Args: {
          phone: string;
          id: string;
        };
        Returns: Json;
      };
      manychat_sync: {
        Args: {
          phone: string;
          id: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America";
      events_status: "Draft" | "In Review" | "Published";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
