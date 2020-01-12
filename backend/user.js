import { update, get, find, Q } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';

const userPrefix = 'user_';


/* @expose */
export async function createOrGetUser() {
  const user = getCurrentUser();
  if (!user) {
    return user;
  }

  return await update(`${userPrefix}${user.id}`, (oldUser = {}) =>
    ({ ...oldUser, ...user }));
}
