import React, { useState, createContext, useEffect } from 'react';
import { endpoints } from '../constants/endpoints';
import { User } from '../models';
import { useApi } from './ApiService';

const UserContext = createContext<
  [User | undefined, React.Dispatch<React.SetStateAction<User | undefined>>] | undefined
>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userDetails = useState<User | undefined>();
  const { httpGet } = useApi(endpoints.users);

  useEffect(() => {
    const userId = localStorage.getItem('user-id');
    if (!userId) return;

    httpGet('/' + userId).then((user: User) => {
      userDetails[1](user);
    });
  }, []);

  return <UserContext.Provider value={userDetails}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
