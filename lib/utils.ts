import { type ClassValue, clsx } from 'clsx';
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
    return upper ? months[monthNumber + 1] : months[monthNumber].toLowerCase();
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
];


export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, exchangeRates: Record<string, number>) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const exchangeRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
  return amount * exchangeRate;
}

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  const res = await fetch("https://api.exchangerate.host/latest");

  const data = await res.json();

  return data.rates
}