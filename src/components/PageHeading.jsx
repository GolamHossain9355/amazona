import React from 'react'

function PageHeading({ children, className = "" }) {
    return (
        <h1 className={`mb-4 text-xl ${className}`}>{children}</h1>
    )
}

export default PageHeading