import Link from "next/link";

interface ProductReelProps {
    title: string
    subtitle?: string;
    href?: string;
};

const ProductReel = (props: ProductReelProps) => {
    const { title, subtitle, href } = props;
    console.log(href)

  return (
    <section>
        <div className="md:flex md:items-center md:justify-between mb-4">
            <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                { title ? <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{ title } </h1> : null }
                { subtitle ? <p className="mt-2 text-muted-foreground text-sm">{ subtitle }</p> : null }
            </div>

            { href ? <Link href={ href } className="hidden text-sm font-medium text-blue-600 hover:text-blue-500">Shop the collection <span aria-hidden="true" />&rarr;</Link> : null }
        </div>
    </section>
  )
}

export default ProductReel;