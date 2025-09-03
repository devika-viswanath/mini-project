import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Cart = () => {
    const { products, cartItems, currency, addToCart, removeFromCart, updateCartItem } = useAppContext()
    const navigate = useNavigate()
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery')

    // Calculate cart data
    const getCartData = () => {
        let tempData = []
        let totalAmount = 0
        
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = products.find((product) => product._id === itemId)
                if (itemInfo) {
                    tempData.push({
                        _id: itemId,
                        quantity: cartItems[itemId],
                        ...itemInfo
                    })
                    totalAmount += itemInfo.offerPrice * cartItems[itemId]
                }
            }
        }
        return { tempData, totalAmount }
    }

    const { tempData: cartData, totalAmount } = getCartData()
    const shippingFee = totalAmount > 50 ? 0 : 5
    const tax = totalAmount * 0.02 // 2% tax
    const finalTotal = totalAmount + shippingFee + tax

    const handlePlaceOrder = () => {
        if (!deliveryAddress) {
            alert('Please add a delivery address')
            return
        }
        alert('Order placed successfully!')
        navigate('/')
    }

    if (cartData.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <img src={assets.cart_icon} alt="Empty cart" className="w-20 h-20 opacity-50 mb-4" />
                <h2 className="text-2xl font-medium text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some products to get started</p>
                <button 
                    onClick={() => navigate('/products')} 
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Continue Shopping
                </button>
            </div>
        )
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shopping Cart Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-medium text-gray-800">
                            Shopping Cart <span className="text-base text-gray-500">{cartData.length} items</span>
                        </h1>
                    </div>

                    {/* Cart Header */}
                    <div className="hidden md:grid grid-cols-4 gap-4 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                        <div>Product Details</div>
                        <div className="text-center">Subtotal</div>
                        <div className="text-center">Action</div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4 mt-4">
                        {cartData.map((item) => (
                            <div key={item._id} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-gray-100 items-center">
                                {/* Product Details */}
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={item.image[0]} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-cover rounded-md"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                        }}
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Weight: N/A</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className="text-center">
                                    <p className="font-medium">{currency}{(item.offerPrice * item.quantity).toFixed(2)}</p>
                                </div>

                                {/* Action - Quantity Controls */}
                                <div className="flex items-center justify-center gap-2">
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                                        <button 
                                            onClick={() => addToCart(item._id)}
                                            className="px-3 py-1 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => updateCartItem(item._id, 0)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <img src={assets.remove_icon} alt="Remove" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Continue Shopping */}
                    <div className="mt-6">
                        <button 
                            onClick={() => navigate('/products')}
                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition"
                        >
                            <span>←</span> Continue Shopping
                        </button>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                        <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                        {/* Delivery Address */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-700 mb-2">DELIVERY ADDRESS</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-600">
                                    {deliveryAddress || 'No address found'}
                                </span>
                                <button 
                                    onClick={() => {
                                        const address = prompt('Enter your delivery address:')
                                        if (address) setDeliveryAddress(address)
                                    }}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                    Change
                                </button>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-6">
                            <h3 className="font-medium text-gray-700 mb-2">PAYMENT METHOD</h3>
                            <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span>Price</span>
                                <span>{currency}{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee</span>
                                <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                                    {shippingFee === 0 ? 'Free' : `${currency}${shippingFee.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (2%)</span>
                                <span>{currency}{tax.toFixed(2)}</span>
                            </div>
                            <hr className="border-gray-300" />
                            <div className="flex justify-between font-medium text-lg">
                                <span>Total Amount:</span>
                                <span>{currency}{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition font-medium"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
