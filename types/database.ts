// ============================================================
// SVERA – TypeScript Database Types
// Generated from supabase/schema.sql
// ============================================================

export type UserRole = "admin";

export type PostCategory =
  | "birth_info"
  | "marriage_info"
  | "death_info"
  | "general_news";

export interface Profile {
  id: string;
  full_name: string;
  phone_number: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: PostCategory;
  image_url: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  created_at: string;
}

export type ProfileInsert = Omit<Profile, "created_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at">>;

export type PostInsert = Omit<Post, "id" | "created_at">;
export type PostUpdate = Partial<Omit<Post, "id" | "author_id" | "created_at">>;

export interface PostWithAuthor extends Post {
  author: Pick<Profile, "id" | "full_name" | "avatar_url" | "role">;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: PostUpdate;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at">;
        Update: Partial<Omit<Event, "id" | "created_at">>;
      };
    };
  };
}
