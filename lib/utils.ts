import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moneyFormat(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];


export function getMonth(monthNumber: number) {
  if (monthNumber >= 0 && monthNumber < months.length) {
      return months[monthNumber].toLowerCase();
  } else {
      return "Invalid Month Number";
  }
}

export function getMonthIndex(monthName: string): number {
  const index = months.findIndex(month => month.toLowerCase() === monthName.toLowerCase());
  return index !== -1 ? index : -1; // Return -1 for invalid month name
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
  }
];
