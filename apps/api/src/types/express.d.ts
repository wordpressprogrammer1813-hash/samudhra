import type { Profile } from '@samudra/shared';
import type { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      /** Set by `requireAuth`; absent on public routes. */
      auth?: {
        user: User;
        profile: Profile;
        accessToken: string;
      };
    }
  }
}

export {};
