import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import type SwiperType from 'swiper';
import { useEffect, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { cn } from '@/lib/utils';

interface ImageSliderProps {
    urls: string[]
}

const ImageSlider = ({ urls }: ImageSliderProps) => {
    const [ swiper, setSwiper ] = useState<null | SwiperType>(null);
    const [ activeIndex, setActiveIndex ] = useState(0);            // Current active index.
    const [ slideConfig, setSlideConfig ] = useState({              // To keep track of beginning and end for swiper
        isBeginning: true,
        isEnd: activeIndex === (urls.length ?? 0) -1
    });

    useEffect(()=> {                                                // Swiper provide .on method which we can use to detect slideChange event, it provides activeIndex in callback.
        swiper?.on("slideChange" ,({ activeIndex })=> {
            setActiveIndex(activeIndex);
            setSlideConfig({
                isBeginning: activeIndex === 0,
                isEnd: activeIndex === (urls.length ?? 0) -1
            })
        })
    }, [swiper, urls]);

    const activeStyles = "active:scale-[0.97] grid opacity-100 hover:scale-105 absoulte top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300"
    const inActiveStyle = "hidden text-gray-400";

  return (
    <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
        <div className="absoulte z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
            <button className={ cn(activeStyles, "right-3 transition" ,{ [ inActiveStyle ]: slideConfig.isEnd, "hover:bg-primary-300 text-primary-800 opacity-100": !slideConfig.isEnd }) }></button>
            <button></button>
        </div>

        <Swiper className='w-full h-full' onSwiper={ (swiper) => setSwiper(swiper)} spaceBetween={ 50 } slidesPerView={ 1 } modules={[ Pagination ]}>
            { urls.map((url, i)=> (
                <SwiperSlide key={ i } className='-z-10 relative h-full w-full'>
                    <Image fill loading='eager' className='-z-10 h-full w-full object-cover object-center' src={url} alt='Product Image' />
                </SwiperSlide>
            )) 
            }
        </Swiper>
    </div>
  )
}

export default ImageSlider