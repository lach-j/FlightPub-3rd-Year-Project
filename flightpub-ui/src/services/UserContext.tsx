import React, { useState, createContext } from 'react';
import { User } from '../models';

const UserContext = createContext<
  [User | undefined, React.Dispatch<React.SetStateAction<User | undefined>>] | undefined
>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const userDetails = useState<User | undefined>();
  return <UserContext.Provider value={userDetails}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
