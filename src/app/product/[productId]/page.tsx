import MaxWidthWrapper from "@/components/MaxWidthWrapper"

interface PageProps {
  params: {
    productId: string
  }  
}

const page = ({ params }: PageProps) => {
  const BREADCRUMBS = [
    { id:1, name: 'Home', href: '/' },
    { id:2, name: 'Products', href: '/products' },
  ]

  return (
    <div>
       <MaxWidthWrapper className="bg-white">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg">
            Test
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default page