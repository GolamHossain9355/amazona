import React, { createContext, useContext, useEffect, useReducer } from "react"
import { CartActions } from "./enums"

export const Store = createContext()

function reducer(state, action) {
   const allCartItems = state.cart.cartItems

   switch (action.type) {
      case CartActions.CART_ADD_ITEM: {
         const newItem = action.payload
         const existItem = allCartItems.find(
            (item) => item.slug === newItem.slug
         )

         let cartItems
         if (existItem) {
            cartItems = allCartItems.map((item) =>
               item.slug === existItem.slug ? newItem : item
            )
         } else {
            cartItems = [...allCartItems, newItem]
         }

         const updatedCart = { ...state.cart, cartItems }
         const storedCart = JSON.parse(sessionStorage.getItem("cart"))
         if (storedCart) {
            storedCart.cart = updatedCart
            sessionStorage.setItem("cart", JSON.stringify({ ...storedCart }))
         } else {
            sessionStorage.setItem(
               "cart",
               JSON.stringify({ cart: updatedCart })
            )
         }

         return { ...state, cart: updatedCart }
      }

      case CartActions.CART_REMOVE_ITEM: {
         const itemToRemove = action.payload
         const cartItems = allCartItems.filter(
            (item) => item.slug !== itemToRemove.slug
         )

         const updatedCart = { ...state.cart, cartItems }
         const storedCart = JSON.parse(sessionStorage.getItem("cart"))
         if (storedCart) {
            storedCart.cart = updatedCart
            sessionStorage.setItem("cart", JSON.stringify({ ...storedCart }))
         } else {
            sessionStorage.setItem(
               "cart",
               JSON.stringify({ cart: updatedCart })
            )
         }

         return { ...state, cart: updatedCart }
      }

      case CartActions.CART_INITIAL_ITEMS: {
         const cartItems = action.payload.cart.cartItems
         const updatedCart = { ...state.cart, cartItems }

         return { ...state, cart: updatedCart }
      }

      default:
         return state
   }
}

export function StoreProvider({ children }) {
   const [state, dispatch] = useReducer(reducer, { cart: { cartItems: [] } })

   useEffect(() => {
      const storedCart = JSON.parse(sessionStorage.getItem("cart"))
      if (storedCart?.cart?.cartItems?.length > 0) {
         dispatch({
            type: CartActions.CART_INITIAL_ITEMS,
            payload: storedCart,
         })
      }
   }, [])

   const value = { state, dispatch }

   return <Store.Provider value={value}>{children}</Store.Provider>
}

export function useSessionStorage() {
   return useContext(Store)
}
