import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moneyFormat(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function dateFormat(date: Date) {
  return new Intl.DateTimeFormat("en-GB").format(date);
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

const dayOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayOfWeek(day: number) {
  return dayOfWeek[day - 1];
}
