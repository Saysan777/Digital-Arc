import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface optionsInterface {
   currency?: "USD" | "EUR" | "GBP" | "BDT", 
   notation?: Intl.NumberFormatOptions['notation'] 
}

export function formatPrice (price: number| string, options: optionsInterface = {} ) {
  const { currency = "USD", notation = "compact" } = options

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return  new Intl.NumberFormat('en-us', { style:'currency', currency, notation, maximumFractionDigits: 2 }).format(numericPrice);
}