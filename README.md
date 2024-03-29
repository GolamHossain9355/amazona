# Amazona E-Commerce Website

An e-commerce platform that enables users to explore, purchase, and manage a diverse range of products. This project leverages [Next.js](https://nextjs.org/), [NextAuth](https://next-auth.js.org/), [MongoDB](https://www.mongodb.com/), and integrates payment options through [PayPal](https://www.paypal.com/).

## Table of Contents

-  [Features](#features)
-  [Demo](#demo)
-  [Getting Started](#getting-started)
-  [Authentication](#authentication)
-  [Usage](#usage)
-  [Admin Dashboard](#admin-dashboard)
-  [Order History](#order-history)
-  [Technologies](#technologies)
-  [Contributing](#contributing)
-  [License](#license)

## Features

-  Intuitive home page displaying product name, brand, and cost.
-  Add products to the cart from both the home page and individual product pages.
-  Detailed individual product pages with category, rating and description.
-  User-friendly shopping cart page with item table, quantity adjustment, and subtotal calculation.
-  Secure checkout process with options for PayPal, Stripe, and cash-on-delivery. (Currently only Paypal functionality is available)
-  Account management and private routes using NextAuth for authentication.
-  Order placement and tracking, including order history and status.
-  Admin dashboard with sales report chart, order management, product editing, and user control.

## Demo

-  Demo: `https://amazona-amber.vercel.app`

1. Login:

-  ![Project Screenshot](./public/images/project/login.png)

2. Home:

-  ![Project Screenshot](./public/images/project/home.png)

3. Product Details:

-  ![Project Screenshot](./public/images/project/product-detail.png)

4. Shopping Cart:

-  ![Project Screenshot](./public/images/project/cart.png)

5. Shipping Address:

-  ![Project Screenshot](./public/images/project/shipping.png)

6. Payment Method:

-  ![Project Screenshot](./public/images/project/payment-method.png)

7. Place Order:

-  ![Project Screenshot](./public/images/project/place-order.png)

8. Order Details:

-  ![Project Screenshot](./public/images/project/order-detail.png)

9. Order History

-  ![Project Screenshot](./public/images/project/order-history.png.png)

10. Update Profile:

-  ![Project Screenshot](./public/images/project/update-profile.png)

11. Admin Dashboard:

-  ![Project Screenshot](./public/images/project/admin-dashboard.png)

12. Admin Orders:

-  ![Project Screenshot](./public/images/project/admin-orders.png)

13. Admin Products:

-  ![Project Screenshot](./public/images/project/admin-products.png)

14. Admin Edit Products:

-  ![Project Screenshot](./public/images/project/admin-edit-product.png)

15. Users:

-  ![Project Screenshot](./public/images/project/admin-users.png)

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/GolamHossain9355/amazona.git`
2. Install dependencies: `npm install`
3. Set up environment variables:
   -  Create a `.env` file in the root directory.
   -  Add your MongoDB connection URL, NextAuth configuration, and payment API keys.
4. Start the project: `npm run dev`
5. Open your browser and go to `http://localhost:3000`.

## Authentication

This project uses NextAuth for authentication, enabling secure private routes and user account management. You can sign up or log in to access the full features of the platform. Only logged-in users can initiate the checkout process.

## Usage

Welcome to the Amazona E-Commerce Website! This section will guide you through exploring products, making purchases, and managing your shopping experience.

1. **Browsing and Adding to Cart:**

   -  Upon visiting the platform, you'll encounter the home page showcasing a variety of products. Click the "Add to Cart" button to add products to your cart.

2. **Product Details:**

   -  Clicking on a product leads to its individual page with detailed information like category, rating, and description. Use the "Add to Cart" button here as well.

3. **Shopping Cart:**

   -  Access your shopping cart from the top right corner. The cart page presents a table of your selected items, offering the ability to adjust quantities and remove products. The subtotal is calculated automatically.

4. **Checkout:**

   -  Proceed to checkout from the cart page. If you're not logged in, you'll be directed to the login screen. Once logged in, the process continues to the shipping page.

5. **Payment Options:**

   -  On the payment page, select your preferred payment option: PayPal, Stripe, or cash-on-delivery. Afterward, confirm your inputs on the "Place Order" page. (Currently, only Paypal is functional)

6. **Order Tracking:**

   -  The order details page provides comprehensive information on your order, including payment status and delivery status. The order history page shows a record of past orders.

## Admin Dashboard

If you're an admin user, you'll have access to the admin dashboard, offering advanced management capabilities.

1. **Sales Report:**

   -  The dashboard includes a sales report chart displaying total sales, orders, products, and users.

2. **Order Management:**

   -  Admins can manage orders, view their details, and track payment and delivery statuses.

3. **Product Editing:**

   -  The admin dashboard enables product editing, allowing you to update product details as needed.

4. **User Control:**

   -  Admins can view and manage user accounts, including the option to delete accounts if necessary.

## Technologies

-  Next.js
-  NextAuth.JS
-  JavaScript
-  Tailwind
-  Node.js
-  MongoDB
-  Paypal API
-  Vercel
