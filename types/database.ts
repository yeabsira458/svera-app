// ============================================================
// SVERA – TypeScript Database Types
// Generated from supabase/schema.sql
// ============================================================

// ----- Enums / Unions -----

export type UserRole = "citizen" | "admin";

export type PostCategory =
  | "birth_info"
  | "marriage_info"
  | "death_info"
  | "general_news";

export type SubmissionStatus =
  | "pending"
  | "under_review"
  | "approved_and_posted"
  | "rejected";

// ----- Table Row Types -----

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

export interface Submission {
  id: string;
  citizen_id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

// ----- Insert / Update helpers -----

export type ProfileInsert = Omit<Profile, "created_at">;
export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at">>;

export type PostInsert = Omit<Post, "id" | "created_at">;
export type PostUpdate = Partial<Omit<Post, "id" | "author_id" | "created_at">>;

export type SubmissionInsert = Omit<
  Submission,
  "id" | "status" | "admin_notes" | "created_at"
>;
export type SubmissionUpdate = Partial<
  Pick<Submission, "status" | "admin_notes">
>;

export type CommentInsert = Omit<Comment, "id" | "created_at">;

// ----- Joined / View Types -----

/** Post with the author profile attached (for feed rendering) */
export interface PostWithAuthor extends Post {
  author: Pick<Profile, "id" | "full_name" | "avatar_url" | "role">;
}

/** Comment with the author profile attached */
export interface CommentWithAuthor extends Comment {
  author: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

/** Submission with the citizen profile attached (for admin review) */
export interface SubmissionWithCitizen extends Submission {
  citizen: Pick<Profile, "id" | "full_name" | "phone_number">;
}

// ----- Supabase Database type map -----

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
      submissions: {
        Row: Submission;
        Insert: SubmissionInsert;
        Update: SubmissionUpdate;
      };
      comments: {
        Row: Comment;
        Insert: CommentInsert;
        Update: Partial<Comment>;
      };
    };
  };
}
