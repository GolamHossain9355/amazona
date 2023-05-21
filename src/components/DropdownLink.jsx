import React from "react"
import Link from "next/link"

function DropdownLink({ children, href, ...rest }) {
   return (
      <Link href={href} {...rest}>
         {children}
      </Link>
   )
}

export default DropdownLink
