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
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getDayOfWeek(day: number) {
  return dayOfWeek[day - 1];
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

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s]+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace consecutive hyphens with a single hyphen
    .trim(); // Remove leading and trailing spaces
}

// Function to unslugify a string
export function unslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
