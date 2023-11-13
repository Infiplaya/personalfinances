'use client';
import { TransactionFormData } from '@/db/queries/transactions';
import React, { createContext} from 'react';

const useData = (data: TransactionFormData) => data;
export const TransactionFormDataContext = createContext<ReturnType<
  typeof useData
> | null>(null);

export const useTransactionFormData = () => {
  const data = React.useContext(TransactionFormDataContext);
  if (!data) {
    throw new Error('useCurrencies must be used within a CurrenciesProvider');
  }
  return data;
};

const TransactionFormDataProvider = ({
  data,
  children,
}: {
  data: TransactionFormData;
  children: React.ReactNode;
}) => {
  return (
    <TransactionFormDataContext.Provider value={data}>
      {children}
    </TransactionFormDataContext.Provider>
  );
};

export default TransactionFormDataProvider;
