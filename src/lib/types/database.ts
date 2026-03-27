export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          role: 'parent' | 'learner'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: 'parent' | 'learner'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: 'parent' | 'learner'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      households: {
        Row: {
          id: string
          parent_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'households_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      learners: {
        Row: {
          id: string
          household_id: string
          name: string
          grade_level: number
          avatar_emoji: string
          streak_days: number
          last_active_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          grade_level?: number
          avatar_emoji?: string
          streak_days?: number
          last_active_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          grade_level?: number
          avatar_emoji?: string
          streak_days?: number
          last_active_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'learners_household_id_fkey'
            columns: ['household_id']
            isOneToOne: false
            referencedRelation: 'households'
            referencedColumns: ['id']
          }
        ]
      }
      subjects: {
        Row: {
          id: string
          learner_id: string
          name: string
          is_core: boolean
          color: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          learner_id: string
          name: string
          is_core?: boolean
          color?: string
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          learner_id?: string
          name?: string
          is_core?: boolean
          color?: string
          icon?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subjects_learner_id_fkey'
            columns: ['learner_id']
            isOneToOne: false
            referencedRelation: 'learners'
            referencedColumns: ['id']
          }
        ]
      }
      standards: {
        Row: {
          id: string
          grade_level: number
          domain: string
          domain_name: string
          standard_code: string
          description: string
          order_index: number
        }
        Insert: {
          id?: string
          grade_level: number
          domain: string
          domain_name: string
          standard_code: string
          description: string
          order_index?: number
        }
        Update: {
          id?: string
          grade_level?: number
          domain?: string
          domain_name?: string
          standard_code?: string
          description?: string
          order_index?: number
        }
        Relationships: []
      }
      learner_skills: {
        Row: {
          id: string
          learner_id: string
          standard_id: string
          status: 'not_started' | 'practicing' | 'mastered'
          correct_streak: number
          attempts: number
          mastered_at: string | null
          last_practiced_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          learner_id: string
          standard_id: string
          status?: 'not_started' | 'practicing' | 'mastered'
          correct_streak?: number
          attempts?: number
          mastered_at?: string | null
          last_practiced_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          learner_id?: string
          standard_id?: string
          status?: 'not_started' | 'practicing' | 'mastered'
          correct_streak?: number
          attempts?: number
          mastered_at?: string | null
          last_practiced_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'learner_skills_learner_id_fkey'
            columns: ['learner_id']
            isOneToOne: false
            referencedRelation: 'learners'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'learner_skills_standard_id_fkey'
            columns: ['standard_id']
            isOneToOne: false
            referencedRelation: 'standards'
            referencedColumns: ['id']
          }
        ]
      }
      practice_sessions: {
        Row: {
          id: string
          learner_id: string
          subject_id: string | null
          standard_id: string | null
          session_type: 'math_practice' | 'flashcard_review' | 'free_learning'
          started_at: string
          ended_at: string | null
          duration_minutes: number | null
          questions_attempted: number
          questions_correct: number
          ai_hints_given: number
          notes: string | null
        }
        Insert: {
          id?: string
          learner_id: string
          subject_id?: string | null
          standard_id?: string | null
          session_type?: 'math_practice' | 'flashcard_review' | 'free_learning'
          started_at?: string
          ended_at?: string | null
          duration_minutes?: number | null
          questions_attempted?: number
          questions_correct?: number
          ai_hints_given?: number
          notes?: string | null
        }
        Update: {
          id?: string
          learner_id?: string
          subject_id?: string | null
          standard_id?: string | null
          session_type?: 'math_practice' | 'flashcard_review' | 'free_learning'
          started_at?: string
          ended_at?: string | null
          duration_minutes?: number | null
          questions_attempted?: number
          questions_correct?: number
          ai_hints_given?: number
          notes?: string | null
        }
        Relationships: []
      }
      flashcard_decks: {
        Row: {
          id: string
          learner_id: string
          subject_id: string | null
          name: string
          description: string | null
          card_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          learner_id: string
          subject_id?: string | null
          name: string
          description?: string | null
          card_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          learner_id?: string
          subject_id?: string | null
          name?: string
          description?: string | null
          card_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          id: string
          deck_id: string
          learner_id: string
          card_type: 'fact' | 'concept' | 'process' | 'visual'
          front: string
          back: string
          ease_factor: number
          interval_days: number
          repetitions: number
          due_date: string
          last_reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          learner_id: string
          card_type?: 'fact' | 'concept' | 'process' | 'visual'
          front: string
          back: string
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          due_date?: string
          last_reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          learner_id?: string
          card_type?: 'fact' | 'concept' | 'process' | 'visual'
          front?: string
          back?: string
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          due_date?: string
          last_reviewed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      learning_logs: {
        Row: {
          id: string
          learner_id: string
          subject_id: string | null
          log_date: string
          duration_minutes: number | null
          notes: string | null
          mood: 'great' | 'ok' | 'hard' | null
          created_at: string
        }
        Insert: {
          id?: string
          learner_id: string
          subject_id?: string | null
          log_date?: string
          duration_minutes?: number | null
          notes?: string | null
          mood?: 'great' | 'ok' | 'hard' | null
          created_at?: string
        }
        Update: {
          id?: string
          learner_id?: string
          subject_id?: string | null
          log_date?: string
          duration_minutes?: number | null
          notes?: string | null
          mood?: 'great' | 'ok' | 'hard' | null
          created_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          id: string
          learner_id: string
          subject_id: string | null
          resource_type: 'youtube' | 'link' | 'book' | 'other'
          title: string
          url: string | null
          thumbnail_url: string | null
          description: string | null
          tags: string[]
          saved_at: string
        }
        Insert: {
          id?: string
          learner_id: string
          subject_id?: string | null
          resource_type?: 'youtube' | 'link' | 'book' | 'other'
          title: string
          url?: string | null
          thumbnail_url?: string | null
          description?: string | null
          tags?: string[]
          saved_at?: string
        }
        Update: {
          id?: string
          learner_id?: string
          subject_id?: string | null
          resource_type?: 'youtube' | 'link' | 'book' | 'other'
          title?: string
          url?: string | null
          thumbnail_url?: string | null
          description?: string | null
          tags?: string[]
          saved_at?: string
        }
        Relationships: []
      }
      artifacts: {
        Row: {
          id: string
          learner_id: string
          subject_id: string | null
          title: string
          description: string | null
          artifact_type: 'note' | 'photo' | 'drawing'
          storage_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          learner_id: string
          subject_id?: string | null
          title: string
          description?: string | null
          artifact_type?: 'note' | 'photo' | 'drawing'
          storage_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          learner_id?: string
          subject_id?: string | null
          title?: string
          description?: string | null
          artifact_type?: 'note' | 'photo' | 'drawing'
          storage_path?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          hint_level: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          hint_level?: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          hint_level?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
