import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Database {
  public: {
    Tables: {
      mushroom_varieties: {
        Row: {
          id: string
          name: string
          scientific: string
          description: string
          effects: string[]
          potency: 'Moderate' | 'Moderate-High' | 'High' | 'Very High'
          duration: string
          color: string
          image: string | null
          tier: 'Light Tier' | 'Medium Tier' | 'Boomers' | 'MegaBooms'
          pricing: {
            [key: string]: string
          }
          category: 'mushroom' | 'specialty'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific: string
          description: string
          effects: string[]
          potency: 'Moderate' | 'Moderate-High' | 'High' | 'Very High'
          duration: string
          color: string
          image?: string | null
          tier: 'Light Tier' | 'Medium Tier' | 'Boomers' | 'MegaBooms'
          pricing: {
            [key: string]: string
          }
          category?: 'mushroom' | 'specialty'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific?: string
          description?: string
          effects?: string[]
          potency?: 'Moderate' | 'Moderate-High' | 'High' | 'Very High'
          duration?: string
          color?: string
          image?: string | null
          tier?: 'Light Tier' | 'Medium Tier' | 'Boomers' | 'MegaBooms'
          pricing?: {
            [key: string]: string
          }
          category?: 'mushroom' | 'specialty'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 