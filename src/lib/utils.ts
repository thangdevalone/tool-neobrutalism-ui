import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStringNumber(input: number): string {
  const inputStr = input.toString();
  if (inputStr.length === 3) return inputStr;

  return inputStr.padStart(3, '0');
}