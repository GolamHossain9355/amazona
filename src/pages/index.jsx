import Layout from "@/components/Layout"
import ProductItem from "@/components/ProductItem"
import db from './../utils/db';
import Product from "@/models/product";
import { useStoreContext } from '@/utils/Store';
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { CartActions } from '@/utils/enums';

export default function Home({ products }) {
   const router = useRouter()
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
         type: CartActions.CART_ADD_ITEM,
         payload: { ...product, quantity },
      })

      toast.success("Product added to cart successfully")
   }

   return (
      <Layout title="Home Page">
         <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products?.map((product) => (
               <ProductItem
                  key={`${product.name + product.price}`}
                  product={product}
                  addToCartHandler={addToCartHandler}
               />
            ))}
         </div>
      </Layout>
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
