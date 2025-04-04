import { createContext, useState } from 'react';

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState('Inicio'); // Valor inicial

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
