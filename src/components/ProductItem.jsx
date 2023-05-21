/* eslint-disable @next/next/no-img-element */
import React from "react"
import Link from "next/link"

function ProductItem({ product }) {
   return (
      <div className="card">
         <Link href={`/product/${product.slug}`}>
            <img
               src={product.image}
               alt={product.name}
               className="round shadow"
            />
         </Link>

         <div className="mt-2 flex flex-col items-center justify-center gap-2 pb-5">
            <Link href={`/product/${product.slug}`}>
               <h2 className="text-lg">{product.name}</h2>
            </Link>

            <p>{product.brand}</p>

            <p>${product.price}</p>

            <button className="primary-button" type="button">
               Add to cart
            </button>
         </div>
      </div>
   )
}

export default ProductItem
