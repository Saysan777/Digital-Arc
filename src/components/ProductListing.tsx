"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
    product: Product | null;
    index: number
}

const ProductListing = ({ product, index }: ProductListingProps) => {
    const [isVisible, setIsVisible ] = useState<boolean>(false);

    // To show skeleton and then show product with certain delay to achive good UI experience based on index.
    useEffect(()=> {
        const timer = setTimeout(()=> {
            setIsVisible(true)
        }, index * 100);

        return () => clearTimeout(timer);
    }, [index])

    if(!product || !isVisible) return <ProductPlaceHolder />

    const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label

    const validUrls = product.images.map(({ image })=> typeof image === 'string' ? image : image.url).filter(Boolean) as string[]; 

    if(isVisible && product) {
        return <Link href={ `/products/${product.id}` } 
                    className={ cn('invisible h-full w-full cursor-pointer group/main', { 'visible animate-in fade-in-5': isVisible })} 
                    onClick={ () => setIsVisible(false) }>
                        <div className="flex flex-col w-full">
                            <ImageSlider urls={ validUrls } />

                            <h1 className="mt-4 font-medium text-sm text-gray-700">
                                { product.name }
                            </h1>
                            <p className="mt-1 text-xs text-gray-500">{ label }</p>
                            <p className="mt-1 font-medium text-sm text-gray-900">{ formatPrice(product.price) } </p>
                        </div>
                </Link>
    }
  return (
    <div>ProductListing</div>
  )
}

export default ProductListing;

// Custom Skeleton for above component
const ProductPlaceHolder = () => {
    return (
        <div className="flex flex-col w-full">
            <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
                <Skeleton className="h-full w-full"/>
            </div>
            <Skeleton className="h-4 mt-4 w-2/3 rounded-lg"/>
            <Skeleton className="h-4 mt-2 w-16 rounded-lg"/>
            <Skeleton className="h-4 mt-2 w-12 rounded-lg"/>
        </div>
    )
}
