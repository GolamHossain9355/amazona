import ProductItem from "@/components/ProductItem"
import db from './../utils/db';
import { useStoreContext } from '@/utils/Store';
import axios from "axios";
import { toast } from "react-toastify";
import { ACTIONS } from '@/utils/enums';
import Product from "@/models/Product";

Home.title = "Home Page"
export default function Home({ products }) {
   const {
      state: {
         cart: { cartItems },
      },
      dispatch,
   } = useStoreContext()

   const addToCartHandler = async (product) => {
      const existItem = cartItems.find((item) => item.slug === product.slug)
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

      toast.success("Product added to cart successfully")
   }

   return (
      <>
         <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products?.map((product) => (
               <ProductItem
                  key={`${product.name + product.price}`}
                  product={product}
                  addToCartHandler={addToCartHandler}
               />
            ))}
         </div>
      </>
   )
}

export async function getServerSideProps() {
   await db.connect()

   const products = await Product.find().lean()

   return {
      props: {
         products: db.convertDocToObject(products)
      }
   }
}
