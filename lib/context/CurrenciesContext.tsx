'use client';
import { Currency } from '@/db/schema/finances';
import React, { createContext, useState } from 'react';

const useCurrenciesState = (currencies: Currency[]) =>
  useState<Currency[]>(currencies);

export const CurrenciesContext = createContext<ReturnType<
  typeof useCurrenciesState
> | null>(null);

export const useCurrencies = () => {
  const currencies = React.useContext(CurrenciesContext);
  if (!currencies) {
    throw new Error('useCurrencies must be used within a CurrenciesProvider');
  }
  return currencies;
};

const useUserCurrencyState = (currency: Currency['code']) =>
  useState<Currency['code']>(currency);

export const UserCurrencyContext = createContext<ReturnType<
  typeof useUserCurrencyState
> | null>(null);

export const useUserCurrency = () => {
  const currency = React.useContext(UserCurrencyContext);
  if (!currency) {
    throw new Error('useCurrencies must be used within a CurrenciesProvider');
  }
  return currency;
};

const CurrenciesProvider = ({
  currencies: initialCurrencies,
  userCurrency: initialCurrency,
  children,
}: {
  currencies: Currency[];
  userCurrency: Currency['code'];
  children: React.ReactNode;
}) => {
  const [currencies, setCurrencies] = useCurrenciesState(initialCurrencies);
  const [userCurrency, setUserCurrency] = useUserCurrencyState(initialCurrency);

  return (
    <CurrenciesContext.Provider value={[currencies, setCurrencies]}>
      <UserCurrencyContext.Provider value={[userCurrency, setUserCurrency]}>
        {children}
      </UserCurrencyContext.Provider>
    </CurrenciesContext.Provider>
  );
};

export default CurrenciesProvider;
