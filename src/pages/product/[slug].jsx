import React, { useContext } from "react"
import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import data from "./../../utils/data"
import Link from "next/link"
import Image from "next/image"
import { Store } from "./../../utils/Store"
import { CartActions } from "../../utils/enums"

function ProductScreen() {
   const router = useRouter()
   const {
      state: {
         cart: { cartItems },
      },
      dispatch,
   } = useContext(Store)

   const {
      query: { slug },
   } = useRouter()
   const product = data.products.find((product) => product.slug === slug)

   const addToCartHandler = () => {
      const existItem = cartItems.find((item) => item.slug === slug)
      const quantity = existItem ? existItem.quantity + 1 : 1

      if (quantity > product.countInStock) {
         alert("Sorry. Product is out of stock")
         return
      }

      dispatch({
         type: CartActions.CART_ADD_ITEM,
         payload: { ...product, quantity },
      })

      router.push("/cart")
   }

   if (!product) return <div>Product Not Found</div>

   return (
      <Layout title={product.name}>
         <div className="py-2">
            <Link href="/">Back to Products</Link>
         </div>

         <div className="grid md:grid-cols-4 md:gap-3">
            <div className="md:col-span-2">
               <Image
                  src={product.image}
                  alt={product.name}
                  width={640}
                  height={640}
               />
            </div>

            <div>
               <ul>
                  <li>
                     <h1 className="text-lg">{product.name}</h1>
                  </li>
                  <li>Category: {product.category}</li>
                  <li>Brand: {product.brand}</li>
                  <li>
                     Rating: {product.rating} out of {product.numReviews}{" "}
                     reviews.
                  </li>
                  <li>Description: {product.description}</li>
               </ul>
            </div>

            <div>
               <div className="card p-5">
                  <div className="mb-2 flex justify-between">
                     <div>Price: </div>
                     <div>${product.price}</div>
                  </div>

                  <div className="mb-2 flex justify-between">
                     <div>Status:</div>
                     <div>
                        {product.countInStock > 0 ? (
                           <span className="success">
                              In Stock {product.countInStock}
                           </span>
                        ) : (
                           <span className="error">Unavailable</span>
                        )}
                     </div>
                  </div>

                  <button
                     className="primary-button w-full"
                     type="button"
                     onClick={addToCartHandler}
                  >
                     Add to cart
                  </button>
               </div>
            </div>
         </div>
      </Layout>
   )
}

export default ProductScreen
