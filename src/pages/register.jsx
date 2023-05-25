import { useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { getError } from "@/utils/error"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import PageHeading from '../components/PageHeading';
import axios from "axios"

RegisterScreen.title = "Register"
function RegisterScreen() {
   const { data: session } = useSession();

   const router = useRouter();
   const { redirect } = router.query;

   const {
      handleSubmit,
      register,
      getValues,
      formState: { errors },
   } = useForm();

   useEffect(() => {
      if (session?.user) {
         router.push(redirect || '/');
      }
   }, [router, session, redirect]);


   const submitHandler = async ({ name, email, password }) => {
      try {
         await axios.post('/api/auth/sign-up', {
            name,
            email,
            password,
            csrfToken: getCsrfToken()
         });

         const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
         });
         if (result.error) {
            toast.error(result.error);
         }
      } catch (err) {
         toast.error(getError(err));
      }
   };

   return (
      <>
         <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
         >
            <PageHeading className="text-center text-4xl">Create Account</PageHeading>
            <div className="mb-4">
               <label htmlFor="name">Name</label>
               <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register('name', {
                     required: 'Please enter name',
                  })}
               />
               {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
               )}
            </div>

            <div className="mb-4">
               <label htmlFor="email">Email</label>
               <input
                  type="email"
                  {...register('email', {
                     required: 'Please enter email',
                     pattern: {
                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                        message: 'Please enter valid email',
                     },
                  })}
                  className="w-full"
                  id="email"
               ></input>
               {errors.email && (
                  <div className="text-red-500">{errors.email.message}</div>
               )}
            </div>
            <div className="mb-4">
               <label htmlFor="password">Password</label>
               <input
                  type="password"
                  {...register('password', {
                     required: 'Please enter password',
                     minLength: { value: 6, message: 'password is more than 5 chars' },
                  })}
                  className="w-full"
                  id="password"
                  autoFocus
               ></input>
               {errors.password && (
                  <div className="text-red-500 ">{errors.password.message}</div>
               )}
            </div>
            <div className="mb-4">
               <label htmlFor="confirmPassword">Confirm Password</label>
               <input
                  className="w-full"
                  type="password"
                  id="confirmPassword"
                  {...register('confirmPassword', {
                     required: 'Please enter confirm password',
                     validate: (value) => value === getValues('password'),
                     minLength: {
                        value: 6,
                        message: 'confirm password is more than 5 chars',
                     },
                  })}
               />
               {errors.confirmPassword && (
                  <div className="text-red-500 ">
                     {errors.confirmPassword.message}
                  </div>
               )}
               {errors.confirmPassword &&
                  errors.confirmPassword.type === 'validate' && (
                     <div className="text-red-500 ">Password do not match</div>
                  )}
            </div>

            <div className="mb-4 flex flex-col gap-4 justify-center items-center">
               <button className="custom-button">Register</button>
               <div>
                  Already have an account? &nbsp;
                  <Link href={`/login?redirect=${redirect || '/'}`}>Login</Link>
               </div>
            </div>
         </form>
      </>
   );
}

export default RegisterScreen
