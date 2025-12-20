/**
 * User types - borrowed from auth context
 */
import { UserType } from "../auth";

export interface PublicUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string | null;
}

export type { UserType };
