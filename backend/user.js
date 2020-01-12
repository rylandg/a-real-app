import { update, get } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

/* @expose */
export async function isLoggedIn() {
  const user = getCurrentUser(true);
  return user;
}
