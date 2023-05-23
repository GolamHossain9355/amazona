import React, { createContext, useContext, useEffect, useReducer } from "react"
import { ACTIONS } from "./enums"

export const Store = createContext()

function reducer(state, action) {
   const allCartItems = state.cart.cartItems

   switch (action.type) {
      case ACTIONS.CART_ADD_ITEM: {
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

      case ACTIONS.CART_REMOVE_ITEM: {
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

      case ACTIONS.CART_INITIAL_ITEMS: {
         const cartItems = action.payload.cart.cartItems
         const shippingAddress = action.payload.cart.shippingAddress
         const paymentMethod = action.payload.cart.paymentMethod

         const updatedCart = {
            ...state.cart,
            cartItems,
            shippingAddress,
            paymentMethod,
         }

         return { ...state, cart: updatedCart }
      }

      case ACTIONS.CART_RESET: {
         const updatedCart = {
            ...state.cart,
            cartItems: [],
            shippingAddress: {},
            paymentMethod: "",
         }
         const storedCart = JSON.parse(sessionStorage.getItem("cart"))

         if (storedCart) {
            storedCart.cart = updatedCart
            sessionStorage.setItem("cart", JSON.stringify({ ...storedCart }))
         }

         return { ...state, cart: updatedCart }
      }

      case ACTIONS.CART_CLEAR_ITEMS: {
         const updatedCart = { ...state.cart, cartItems: [] }

         const storedCart = JSON.parse(sessionStorage.getItem("cart"))

         if (storedCart) {
            storedCart.cart = updatedCart
            sessionStorage.setItem("cart", JSON.stringify({ ...storedCart }))
         }

         return { ...state, cart: updatedCart }
      }

      case ACTIONS.SAVE_SHIPPING_ADDRESS: {
         const updatedCart = {
            ...state.cart,
            shippingAddress: {
               ...state.cart.shippingAddress,
               ...action.payload,
            },
         }

         const storedCart = JSON.parse(sessionStorage.getItem("cart"))
         if (storedCart) {
            storedCart.cart = updatedCart
            sessionStorage.setItem("cart", JSON.stringify({ ...storedCart }))
         } else {
            throw new Error("No cart found in session storage")
         }

         return {
            ...state,
            cart: updatedCart,
         }
      }

      case ACTIONS.SAVE_PAYMENT_METHOD: {
         const updatedCart = {
            ...state.cart,
            paymentMethod: action.payload,
         }

         const storedCart = JSON.parse(sessionStorage.getItem("cart"))
         if (storedCart) {
            storedCart.cart = updatedCart
            sessionStorage.setItem("cart", JSON.stringify({ ...storedCart }))
         } else {
            throw new Error("No cart found in session storage")
         }

         return {
            ...state,
            cart: updatedCart,
         }
      }

      default:
         return state
   }
}

export function StoreProvider({ children }) {
   const [state, dispatch] = useReducer(reducer, {
      cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
   })

   useEffect(() => {
      const storedCart = JSON.parse(sessionStorage.getItem("cart"))
      if (storedCart?.cart?.cartItems?.length > 0) {
         dispatch({
            type: ACTIONS.CART_INITIAL_ITEMS,
            payload: storedCart,
         })
      }
   }, [])

   const value = { state, dispatch }

   return <Store.Provider value={value}>{children}</Store.Provider>
}

export function useStoreContext() {
   return useContext(Store)
}
