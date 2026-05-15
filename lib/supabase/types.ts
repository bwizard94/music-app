export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          display_name: string
          avatar_url: string | null
          role: string
          bio: string | null
          city: string | null
          country: string | null
          accent_color: string
          verified: boolean
          pro_member: boolean
          followers_count: number
          following_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          display_name?: string
          avatar_url?: string | null
          role?: string
          bio?: string | null
          city?: string | null
          country?: string | null
          accent_color?: string
          verified?: boolean
          pro_member?: boolean
          followers_count?: number
          following_count?: number
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      artist_profiles: {
        Row: {
          id: string
          profile_id: string
          slug: string
          genres: string[]
          tags: string[]
          draw: number
          fee_min: number
          fee_max: number
          fee_display: string
          social_score: number
          audience_age: string | null
          recent_shows: number
          cover_image_url: string | null
          available_for_booking: boolean
          travel_radius: number | null
          collab_interests: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          slug: string
          genres?: string[]
          tags?: string[]
          draw?: number
          fee_min?: number
          fee_max?: number
          fee_display?: string
          social_score?: number
          audience_age?: string | null
          recent_shows?: number
          cover_image_url?: string | null
          available_for_booking?: boolean
          travel_radius?: number | null
          collab_interests?: string[]
        }
        Update: Partial<Database['public']['Tables']['artist_profiles']['Insert']>
        Relationships: []
      }
      venue_profiles: {
        Row: {
          id: string
          profile_id: string
          slug: string
          name: string
          tagline: string | null
          genres: string[]
          capacity: number
          city: string
          country: string
          accent_color: string
          cover_image_url: string | null
          verified: boolean
          sound_system: Json | null
          lighting_system: Json | null
          rooms: Json | null
          booking_status: string
          preferred_genres: string[]
          min_fee: number | null
          lead_time_days: number | null
          house_rules: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          slug: string
          name: string
          tagline?: string | null
          genres?: string[]
          capacity?: number
          city?: string
          country?: string
          accent_color?: string
          cover_image_url?: string | null
          verified?: boolean
          sound_system?: Json | null
          lighting_system?: Json | null
          rooms?: Json | null
          booking_status?: string
          preferred_genres?: string[]
          min_fee?: number | null
          lead_time_days?: number | null
          house_rules?: string | null
        }
        Update: Partial<Database['public']['Tables']['venue_profiles']['Insert']>
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          profile_id: string
          platform: string
          url: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          platform: string
          url: string
        }
        Update: Partial<Database['public']['Tables']['social_links']['Insert']>
        Relationships: []
      }
      events: {
        Row: {
          id: string
          creator_id: string
          name: string
          tagline: string | null
          venue_id: string | null
          venue_name: string
          venue_city: string
          venue_capacity: number
          status: string
          date_display: string
          doors_time: string | null
          end_time: string | null
          accent_color: string
          cover_image_url: string | null
          ticket_price: string | null
          genres: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          tagline?: string | null
          venue_id?: string | null
          venue_name?: string
          venue_city?: string
          venue_capacity?: number
          status?: string
          date_display?: string
          doors_time?: string | null
          end_time?: string | null
          accent_color?: string
          cover_image_url?: string | null
          ticket_price?: string | null
          genres?: string[]
        }
        Update: Partial<Database['public']['Tables']['events']['Insert']>
        Relationships: []
      }
      event_lineup: {
        Row: {
          id: string
          event_id: string
          artist_id: string
          artist_name: string
          artist_image: string | null
          role: string
          start_time: string | null
          duration_minutes: number | null
          fee: number | null
          status: string
          sort_order: number
        }
        Insert: {
          id?: string
          event_id: string
          artist_id: string
          artist_name: string
          artist_image?: string | null
          role?: string
          start_time?: string | null
          duration_minutes?: number | null
          fee?: number | null
          status?: string
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['event_lineup']['Insert']>
        Relationships: []
      }
      proposals: {
        Row: {
          id: string
          submitted_by_id: string
          submitted_by_name: string
          submitted_by_role: string
          submitted_by_image: string | null
          venue_id: string | null
          venue_name: string
          venue_city: string
          venue_capacity: number
          name: string
          tagline: string | null
          genres: string[]
          proposed_date: string
          doors_time: string | null
          end_time: string | null
          status: string
          estimated_draw: number
          total_artist_fees: number
          production_budget: number
          marketing_budget: number
          ticket_price: string | null
          revenue_split: string | null
          budget_notes: string | null
          venue_response: string | null
          venue_note: string | null
          change_requests: string[] | null
          accent_color: string
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          submitted_by_id: string
          submitted_by_name: string
          submitted_by_role: string
          submitted_by_image?: string | null
          venue_id?: string | null
          venue_name: string
          venue_city: string
          venue_capacity?: number
          name: string
          tagline?: string | null
          genres?: string[]
          proposed_date: string
          doors_time?: string | null
          end_time?: string | null
          status?: string
          estimated_draw?: number
          total_artist_fees?: number
          production_budget?: number
          marketing_budget?: number
          ticket_price?: string | null
          revenue_split?: string | null
          budget_notes?: string | null
          venue_response?: string | null
          venue_note?: string | null
          change_requests?: string[] | null
          accent_color?: string
          submitted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['proposals']['Insert']>
        Relationships: []
      }
      proposal_lineup: {
        Row: {
          id: string
          proposal_id: string
          artist_id: string
          artist_name: string
          artist_image: string | null
          role: string
          genres: string[]
          draw: number
          fee: number
          accent_color: string
        }
        Insert: {
          id?: string
          proposal_id: string
          artist_id: string
          artist_name: string
          artist_image?: string | null
          role?: string
          genres?: string[]
          draw?: number
          fee?: number
          accent_color?: string
        }
        Update: Partial<Database['public']['Tables']['proposal_lineup']['Insert']>
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          type: string
          name: string | null
          accent_color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type?: string
          name?: string | null
          accent_color?: string
        }
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          profile_id: string
          joined_at: string
          last_read_at: string | null
        }
        Insert: {
          conversation_id: string
          profile_id: string
          joined_at?: string
          last_read_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['conversation_participants']['Insert']>
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          sender_name: string
          sender_image: string | null
          body: string
          is_system: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          sender_name: string
          sender_image?: string | null
          body: string
          is_system?: boolean
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewee_id: string
          reviewee_type: string
          rating: number
          body: string
          show_name: string | null
          show_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewee_id: string
          reviewee_type?: string
          rating: number
          body: string
          show_name?: string | null
          show_date?: string | null
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: []
      }
      followers: {
        Row: {
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      local_scenes: {
        Row: {
          id: string
          city: string
          country: string
          slug: string
          description: string | null
          member_count: number
          event_count: number
          accent_color: string
          cover_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          city: string
          country: string
          slug: string
          description?: string | null
          member_count?: number
          event_count?: number
          accent_color?: string
          cover_image_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['local_scenes']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, {
      Row: Record<string, unknown>
      Relationships: []
    }>
    Functions: Record<string, {
      Args: Record<string, unknown>
      Returns: unknown
    }>
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
