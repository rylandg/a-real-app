import { update, get, find, Q, remove } from '@reshuffle/db';
import { getCurrentUser } from '@reshuffle/server-function';
import storage from '@reshuffle/storage';

const userPre = 'user_';
const uploadsPre = 'uploads_';

async function getUser() {
  const { id } = getCurrentUser(true);
  const user = await get(`${userPre}${id}`);
  if (!user) {
    throw new Error(`No user found with that id`);
  }
  return user;
}

/* @expose */
export async function createOrGetUser() {
  const user = getCurrentUser();
  if (!user) {
    return user;
  }

  return await update(`${userPre}${user.id}`, (oldUser = {}) =>
    ({ ...oldUser, ...user }));
}

/* @expose */
export async function uploadUserImage(token) {
  const user = await getUser();
  const objectId = await storage.finalizeUpload(token);
  const url = storage.publicUrl(objectId);
  return await update(`${uploadsPre}${user.id}${objectId}`,
    () => ({ objectId, url }));
}

/* @expose */
export async function removeUserImage(imageId) {
  const user = await getUser();
  return await remove(`${uploadsPre}${user.id}${imageId}`);
}

/* @expose */
export async function getUserImages() {
  const user = await getUser();
  const images = await find(
    Q.filter(
      Q.key.startsWith(`${uploadsPre}${user.id}`)
    ),
  );
  return images.map(({ value }) => value);
}
