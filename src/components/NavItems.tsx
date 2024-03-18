"use client"

import { PRODUCT_CATEGORIES } from "@/config";
import { useEffect, useRef, useState } from "react"
import NavItem  from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const NavItems = () => {
  const [ activeIndex, setActiveIndex ] = useState<null | number>(null);

  // To close the nav, if the user clicks outside.
  const navRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.key === "Escape") {
        setActiveIndex(null)
      }
    }

    document.addEventListener('keydown', handler)

    //cleanup function
    return () => {
      document.removeEventListener('keydown', handler);
    }
  }, [])

  return (
    <div className="flex gap-4 h-full" ref={ navRef }>
        { PRODUCT_CATEGORIES.map((category, i)=> {
            const handleOpen = () => {
                if(activeIndex === i) {
                    setActiveIndex(null);
                } else {
                    setActiveIndex(i)
                }
            };

            const isOpen = i === activeIndex;

            return (
                <NavItem key={ i } handleOpen={ handleOpen } isOpen={ isOpen } category={ category } isAnyOpen={ activeIndex !== null }  />
            )
        }) }
    </div>
  )
}

export default NavItems