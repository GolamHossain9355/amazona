import CheckoutWizard from '@/components/CheckoutWizard'
import PageHeading from '@/components/PageHeading'
import { useStoreContext } from '@/utils/Store'
import React, { useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { ACTIONS } from '@/utils/enums';
import { getCsrfToken } from '@/utils/getCsrfToken';

PlaceOrderScreen.title = "Place Order"
PlaceOrderScreen.auth = true;
function PlaceOrderScreen() {
    const { state, dispatch } = useStoreContext();
    const { cart } = state;
    const { cartItems, shippingAddress, paymentMethod } = cart;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const itemsPrice = round2(
        cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    ); // 123.4567 => 123.46

    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    const router = useRouter();
    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment');
        }
    }, [paymentMethod, router]);

    const [loading, setLoading] = useState(false);

    const placeOrderHandler = async () => {
        try {
            setLoading(true);

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                    csrfToken: await getCsrfToken(),
                }
            );


            setLoading(false);

            router.push(`/order/${data._id}`);
            dispatch({ type: ACTIONS.CART_CLEAR_ITEMS });
        } catch (err) {
            setLoading(false);
            toast.error(getError(err));
        }
    };

    return (
        <>
            <CheckoutWizard activeStep={3} />
            <h1 className="mb-4 text-xl">Place Order</h1>
            {cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href="/">Go shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Shipping Address</h2>
                            <div>
                                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                                {shippingAddress.country}
                            </div>
                            <div>
                                <Link href="/shipping">Edit</Link>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <PageHeading className="mb-2 text-lg">Payment Method</PageHeading>
                            <div>{paymentMethod}</div>
                            <div>
                                <Link href="/payment">Edit</Link>
                            </div>
                        </div>
                        <div className="card overflow-x-auto p-5">
                            <h2 className="mb-2 text-lg">Order Items</h2>
                            <table className="min-w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="px-5 text-left">Item</th>
                                        <th className="    p-5 text-right">Quantity</th>
                                        <th className="  p-5 text-right">Price</th>
                                        <th className="p-5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td>
                                                <Link className="flex items-center" href={`/product/${item.slug}`}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    ></Image>
                                                    &nbsp;
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className=" p-5 text-right">{item.quantity}</td>
                                            <td className="p-5 text-right">${item.price}</td>
                                            <td className="p-5 text-right">
                                                ${item.quantity * item.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <Link href="/cart">Edit</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg">Order Summary</h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Items</div>
                                        <div>${itemsPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Tax</div>
                                        <div>${taxPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Shipping</div>
                                        <div>${shippingPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Total</div>
                                        <div>${totalPrice}</div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        disabled={loading}
                                        onClick={placeOrderHandler}
                                        className="primary-button w-full"
                                    >
                                        {loading ? 'Loading...' : 'Place Order'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


export default PlaceOrderScreen