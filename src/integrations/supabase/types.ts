export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      couples: {
        Row: {
          created_at: string | null
          husband_id: string | null
          id: string
          is_active: boolean | null
          wife_id: string | null
        }
        Insert: {
          created_at?: string | null
          husband_id?: string | null
          id?: string
          is_active?: boolean | null
          wife_id?: string | null
        }
        Update: {
          created_at?: string | null
          husband_id?: string | null
          id?: string
          is_active?: boolean | null
          wife_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "couples_husband_id_fkey"
            columns: ["husband_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couples_wife_id_fkey"
            columns: ["wife_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dimension_entries: {
        Row: {
          created_at: string
          dimension_id: string
          entry_id: string
          id: string
          value: number | null
        }
        Insert: {
          created_at?: string
          dimension_id: string
          entry_id: string
          id?: string
          value?: number | null
        }
        Update: {
          created_at?: string
          dimension_id?: string
          entry_id?: string
          id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_dimension_entries_dimension_id_fkey"
            columns: ["dimension_id"]
            isOneToOne: false
            referencedRelation: "custom_dimensions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_dimension_entries_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "daily_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dimensions: {
        Row: {
          couple_id: string
          created_at: string
          created_by_id: string
          dimension_name: string
          id: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by_id: string
          dimension_name: string
          id?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by_id?: string
          dimension_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_dimensions_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_dimensions_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_entries: {
        Row: {
          created_at: string | null
          emotional_state: number | null
          entry_date: string
          general_feeling: number | null
          horniness_level: number | null
          id: string
          sleep_quality: number | null
          updated_at: string | null
          user_id: string
          voice_note: string | null
        }
        Insert: {
          created_at?: string | null
          emotional_state?: number | null
          entry_date?: string
          general_feeling?: number | null
          horniness_level?: number | null
          id?: string
          sleep_quality?: number | null
          updated_at?: string | null
          user_id: string
          voice_note?: string | null
        }
        Update: {
          created_at?: string | null
          emotional_state?: number | null
          entry_date?: string
          general_feeling?: number | null
          horniness_level?: number | null
          id?: string
          sleep_quality?: number | null
          updated_at?: string | null
          user_id?: string
          voice_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          sender_id: string
          token: string
          used_at: string | null
          used_by_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          sender_id: string
          token: string
          used_at?: string | null
          used_by_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          sender_id?: string
          token?: string
          used_at?: string | null
          used_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_used_by_id_fkey"
            columns: ["used_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          notification_frequency:
            | Database["public"]["Enums"]["notification_frequency"]
            | null
          notification_time: string | null
          notification_time_2: string | null
          notification_time_3: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          notification_frequency?:
            | Database["public"]["Enums"]["notification_frequency"]
            | null
          notification_time?: string | null
          notification_time_2?: string | null
          notification_time_3?: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          notification_frequency?:
            | Database["public"]["Enums"]["notification_frequency"]
            | null
          notification_time?: string | null
          notification_time_2?: string | null
          notification_time_3?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      notification_frequency: "once" | "twice" | "three_times"
      user_role: "husband" | "wife"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_frequency: ["once", "twice", "three_times"],
      user_role: ["husband", "wife"],
    },
  },
} as const
