import axios from "axios"

export async function getCsrfToken() {
   const { data: csrfTokenData } = await axios.get("/api/auth/csrf")
   const csrfToken = csrfTokenData.csrfToken
   return csrfToken
}
