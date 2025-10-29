import { User } from '@supabase/supabase-js';

export interface CustomUser extends User {
  user_metadata: {
    full_name?: string;
  };
}
