import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
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

// Reusable metadata creator for showing title description of our website.
export function constructMetadata({
  title = 'DigitalArc - the marketplace for digital products',
  description = 'DigitalArc is an open-source digital marketplace designed to revolutionize the buying and selling of digital products.',
  image = '/DigitalBazaar.png',
  // icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@pragmaticAlok',
    },
    // icons,
    metadataBase: new URL('https://digital-arc-production.up.railway.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}