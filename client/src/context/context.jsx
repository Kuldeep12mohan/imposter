
import React, { createContext, useState, useContext, ReactNode } from 'react';


const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  return (
    <MyContext.Provider value={{ members, setMembers}}>
      {children}
    </MyContext.Provider>
  );
};
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
