import { useEffect } from "react"
import Layout from "@/components/Layout"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { signIn, useSession } from "next-auth/react"
import { getError } from "@/utils/error"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

function Login() {
   const { data: session } = useSession()
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm()
   const router = useRouter()
   const { redirect } = router.query

   useEffect(() => {
      if (session?.user) {
         router.push(redirect || "/")
      }
   }, [redirect, router, session?.user])

   const loginSubmitHandler = async ({ email, password }) => {
      try {
         const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
         })

         if (result.error) {
            toast.error(result.error)
         }
      } catch (error) {
         toast.error(getError(error))
         console.info(error)
      }
   }

   return (
      <Layout title="Login">
         <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(loginSubmitHandler)}
         >
            <h1 className="mb-4 text-center text-3xl">Login</h1>

            <div className="mb-4">
               <label htmlFor="email">Email: </label>
               <input
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("email", {
                     required: "Please enter email",
                     pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                        message: "Please enter valid email",
                     },
                  })}
                  type="email"
                  id="email"
                  placeholder="Email"
                  autoFocus
               />
               {errors.email && (
                  <div className="mt-1 text-red-500">
                     {errors.email.message}
                  </div>
               )}
            </div>

            <div className="mb-4">
               <label htmlFor="password">Password: </label>
               <input
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("password", {
                     required: "Please enter your password",
                     minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                     },
                  })}
                  type="password"
                  id="password"
                  placeholder="Password"
                  autoFocus
               />
               {errors.password && (
                  <div className="mt-1 text-red-500">
                     {errors.password.message}
                  </div>
               )}
            </div>

            <div className="mb-4 flex w-full flex-col items-center justify-center gap-4">
               <button
                  className="primary-button w-1/3 max-w-[10rem]"
                  type="submit"
               >
                  Login
               </button>
               <div className="mb-4">
                  Don&apos;t have an account? &nbsp;
                  <Link href="/register">Register</Link>
               </div>
            </div>
         </form>
      </Layout>
   )
}

export default Login
