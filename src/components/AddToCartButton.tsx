'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '@/hooks/use-cart'
import { Product } from '@/payload-types'

const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart()
  const [ isSuccess, setIsSuccess ] = useState<boolean>(false)

  // after isSuccess value is chaged when button is clicked, waiting for certain delay.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  const handleAddToCartButtonClick = () => {
    addItem(product)
    setIsSuccess(true)
  }

  return (
    <Button onClick={ handleAddToCartButtonClick } size='lg' className='w-full'>
      { isSuccess ? 'Added!' : 'Add to cart' }
    </Button>
  )
}

export default AddToCartButton
