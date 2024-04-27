
import { Product } from '@/payload-types'
import { toast } from 'sonner'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type CartItem = {
  product: Product
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}
// persist middleware is used to persist data when user refresh the page.
export const useCart = create<CartState>()(
  persist((set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const isProductInCart = state.items.some(item => item.product.id === product.id)

          if(isProductInCart) {
            toast.error('Oops!, item already added to cart');
            return { ...state };
          }
        
          return { items: [...state.items, { product }] }
        }),
      removeItem: (id) =>
        set((state) => {
          const index = state.items.findIndex(item => item.product.id === id);

          if(index === -1) return { ...state }

          return {
            items: [ ...state.items.slice(0, index), ...state.items.slice(index + 1) ]
          }
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
