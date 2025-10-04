export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'mentor';
  avatar_url?: string;
}

export interface Mentor {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  expertise: string[];
  bio: string;
  experience_years: number;
  languages: string[];
  hourly_rate?: number;
  average_rating: number;
  total_sessions: number;
}

export interface Session {
  id: string;
  student_id: string;
  mentor_id: string;
  mentor_name: string;
  mentor_avatar?: string;
  topic: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  additional_notes?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  session_id: string;
  student_id: string;
  mentor_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
