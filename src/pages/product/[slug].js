import React from "react"
import axios from "axios"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { useStoreContext } from "../../utils/Store"
import { ACTIONS } from "../../utils/enums"
import db from "@/utils/db"
import Product from "@/models/Product"
import { toast } from "react-toastify"
import PageHeading from '../../components/PageHeading';

ProductScreen.title = ({ product }) => product ? product.name : "Product Details";
function ProductScreen({ product }) {
   const router = useRouter()
   const {
      state: {
         cart: { cartItems },
      },
      dispatch,
   } = useStoreContext()
   const {
      query: { slug },
   } = useRouter()

   const addToCartHandler = async () => {
      const existItem = cartItems.find((item) => item.slug === slug)
      const quantity = existItem ? existItem.quantity + 1 : 1

      try {
         const { data } = await axios.get(`/api/products/${product._id}`)

         if (data.countInStock < quantity) {
            toast.error("Sorry. Product is out of stock")
            return
         }
      } catch (error) {
         console.error(error)
      }


      dispatch({
         type: ACTIONS.CART_ADD_ITEM,
         payload: { ...product, quantity },
      })

      router.push("/cart")
   }

   if (!product) return <div className="text-2xl text-red-600 text-center">Product Not Found</div>

   return (
      <>
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
                     <PageHeading className="text-lg">{product.name}</PageHeading>
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
      </>
   )
}


export async function getServerSideProps(context) {
   const { params } = context
   const { slug } = params

   await db.connect()
   const foundProduct = await Product.findOne({ slug }).lean()
   await db.disconnect()

   return {
      props: {
         product: foundProduct ? db.convertDocToObject(foundProduct) : null
      }
   }
}

export default ProductScreen
