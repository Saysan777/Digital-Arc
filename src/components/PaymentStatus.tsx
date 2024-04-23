'use client'

import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PaymentStatusProps {
  orderEmail: string
  orderId: string
  isPaid: boolean
}

const PaymentStatus = ({  orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter()

  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,            // we only query as long as isPaid is false.
      refetchInterval: (data) =>            // this is creating polling(fetching data on timely basis)
        data?.isPaid ? false : 1000,        // every 1 sec untill isPaid is false
    }
  )

  useEffect(() => {
    if (data?.isPaid) router.refresh()      // refreshing page after ispaid gets true. So we get brand new text descrption in thank you page.
  }, [ data?.isPaid, router ])

  return (
    <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600'>
      <div>
        <p className='font-medium text-gray-900'>
          Shipping To
        </p>
        <p>{ orderEmail }</p>
      </div>

      <div>
        <p className='font-medium text-gray-900'>
          Order Status
        </p>
        <p>
          {isPaid
            ? 'Payment successful'
            : 'Pending payment'}
        </p>
      </div>
    </div>
  )
}

export default PaymentStatus
