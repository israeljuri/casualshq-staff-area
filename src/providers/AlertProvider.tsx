import React, { createContext, useContext } from 'react';
import useAlert from '@/hooks/useAlert';

const AlertContext = createContext<ReturnType<typeof useAlert> | null>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const alert = useAlert();

  return (
    <AlertContext.Provider value={alert}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};