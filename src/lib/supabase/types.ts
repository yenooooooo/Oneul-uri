/**
 * Supabase DB 테이블 타입 정의
 * Supabase CLI로 자동 생성 가능하지만, 초기에는 수동 정의
 */
export type Database = {
  public: {
    Tables: {
      couples: {
        Row: {
          id: string;
          invite_code: string;
          start_date: string;
          user1_id: string | null;
          user2_id: string | null;
          user1_nickname: string;
          user2_nickname: string;
          user1_emoji: string;
          user2_emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          invite_code: string;
          start_date: string;
          user1_id?: string | null;
          user2_id?: string | null;
          user1_nickname?: string;
          user2_nickname?: string;
          user1_emoji?: string;
          user2_emoji?: string;
        };
        Update: Partial<Database["public"]["Tables"]["couples"]["Insert"]>;
      };
      date_records: {
        Row: {
          id: string;
          couple_id: string;
          author_id: string;
          title: string;
          date: string;
          location: string | null;
          memo: string | null;
          photos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          author_id: string;
          title: string;
          date: string;
          location?: string | null;
          memo?: string | null;
          photos?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["date_records"]["Insert"]>;
      };
      anniversaries: {
        Row: {
          id: string;
          couple_id: string;
          title: string;
          date: string;
          type: string;
          is_recurring: boolean;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          title: string;
          date: string;
          type?: string;
          is_recurring?: boolean;
          memo?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["anniversaries"]["Insert"]>;
      };
      penpal_letters: {
        Row: {
          id: string;
          couple_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          stationery: string;
          photo_url: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          stationery?: string;
          photo_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["penpal_letters"]["Insert"]>;
      };
      wallet_goals: {
        Row: {
          id: string;
          couple_id: string;
          title: string;
          target_amount: number;
          current_amount: number;
          is_achieved: boolean;
          achieved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          title: string;
          target_amount: number;
          current_amount?: number;
        };
        Update: Partial<Database["public"]["Tables"]["wallet_goals"]["Insert"]>;
      };
      wallet_transactions: {
        Row: {
          id: string;
          couple_id: string;
          goal_id: string;
          user_id: string;
          amount: number;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          goal_id: string;
          user_id: string;
          amount: number;
          memo?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["wallet_transactions"]["Insert"]>;
      };
      calendar_events: {
        Row: {
          id: string;
          couple_id: string;
          author_id: string;
          title: string;
          date: string;
          time: string | null;
          category: string;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          author_id: string;
          title: string;
          date: string;
          time?: string | null;
          category?: string;
          memo?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["calendar_events"]["Insert"]>;
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          couple_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          couple_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
        };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
      };
    };
  };
};
