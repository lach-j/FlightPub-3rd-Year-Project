import React, {createContext, useEffect, useState} from 'react';
import {endpoints} from '../constants/endpoints';
import {User} from '../models';
import {useApi} from './ApiService';

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const iUserContextState = {
  user: null,
  setUser: () => {}
};

const UserContext = createContext<UserContextType>(iUserContextState);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const { httpGet } = useApi(endpoints.users);

  useEffect(() => {
    const userId = localStorage.getItem('user-id');
    if (!userId) return;

    httpGet('/' + userId).then((user: User) => {
      setUserDetails(user);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user: userDetails, setUser: setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
