import { type ClassValue, clsx } from 'clsx';
import exchangeRateData from '../exchange-rates.json';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moneyFormat(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currencyCode ?? 'USD',
  }).format(amount);
}

export function dateFormat(date: Date) {
  return new Intl.DateTimeFormat('en-GB').format(date);
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const dayOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function getDayOfWeek(day: number) {
  return dayOfWeek[day];
}

const months = [
  'December',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
];

export function getMonth(monthNumber: number, upper = false) {
  if (monthNumber >= 0 && monthNumber < months.length) {
    return upper ? months[monthNumber] : months[monthNumber].toLowerCase();
  } else {
    return 'Invalid Month Number';
  }
}

export function getMonthIndex(monthName: string): number {
  const index = months.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );
  return index !== -1 ? index : -1;
}

export const links = [
  {
    href: '/',
    label: 'Dashboard',
  },
  {
    href: '/transactions',
    label: 'Transactions',
  },
  {
    href: '/categories',
    label: 'Categories',
  },
  {
    href: '/months',
    label: 'Months Summary',
  },
];

export type NavLink = (typeof links)[number];

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const exchangeRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  return amount * exchangeRate;
}

export async function findExchangeRate(
  fromCurrency: string,
  toCurrency: string
) {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const exchangeRates = await fetchExchangeRates();

  return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
}

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  return exchangeRateData;
}

interface ConversionRates {
  [currencyCode: string]: number;
}

export function getConversionRate(currencyCode: string) {
  const conversionData = exchangeRateData as ConversionRates;
  if (currencyCode in exchangeRateData) {
    return conversionData[currencyCode];
  } else {
    console.error(
      `Conversion rate for currency code ${currencyCode} not found.`
    );
    return null;
  }
}
