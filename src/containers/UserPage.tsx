import '@reshuffle/code-transform/macro';
import React, {
  FC,
  useEffect,
  useState,
  MouseEvent,
} from 'react';

import { useAuth } from '@reshuffle/react-auth';

import {
  getUserImages,
  removeUserImage,
} from '../../backend/user';

import { User } from '../models/User';
import { CustomImage } from '../models/CustomImage';

import '../styles/UserPage.scss';

interface UserPageProps {
  user: User;
}

export const UserPage: FC<UserPageProps> = ({ user }) => {
  const [imgs, setImgs] = useState<CustomImage[]>([]);
  const { getLogoutURL } = useAuth();

  useEffect(() => {
    async function load() {
      const images = await getUserImages();
      setImgs(images as CustomImage[]);
    }
    load();
  }, []);

  return (
    <div className='user-page'>
      Hello {user.displayName}
      <a href={getLogoutURL()}>
        Logout
      </a>
      <div className='image-gallery'>
        {
          imgs.map(({ url, objectId }) => {
            const handleRemove = async (evt: MouseEvent) => {
              evt.preventDefault();
              const removed = await removeUserImage(objectId);
              if (removed) {
                const filtered = imgs.filter(({ objectId: id }) =>
                  id !== objectId);
                setImgs(filtered);
              }
            };
            return (
              <img
                alt='custom img'
                key={objectId}
                src={url}
                className='image'
                onClick={handleRemove}
              />
            );
          })
        }
      </div>
    </div>
  );
}
