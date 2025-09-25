// utils/index.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./error";
export * from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
