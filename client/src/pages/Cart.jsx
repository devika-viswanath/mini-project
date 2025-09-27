import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../../public/assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    user,
    fetchUser,
    products,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    getCartCount,
    getCartAmount,
    currency,
    axios,
    navigate,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("COD");

  // 🟢 1. Ensure user is fetched if not available
  useEffect(() => {
    if (!user?._id) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // 🟢 2. Fetch address once user is available
  useEffect(() => {
    if (!user?._id) return;

    const getUserAddress = async () => {
      try {
        const { data } = await axios.get(`/api/address/get?userId=${user._id}`);
        if (data.success && data.addresses.length > 0) {
          setAddresses(data.addresses);
          setSelectedAddress(data.addresses[0]);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getUserAddress();
  }, [user?._id, axios]);

  // 🟢 3. Build cart UI from cartItems
  const getCart = useCallback(() => {
    const tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  }, [products, cartItems]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems, getCart]);

  const placeOrder = async () => {
    try {
      if (!user?._id) {
        toast.error("Please log in to place an order");
        setShowUserLogin(true);
        return;
      }

      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      const items = Object.keys(cartItems)
        .map((key) => {
          const product = products.find((item) => item._id === key);
          return product
            ? { product: product._id, quantity: cartItems[key] }
            : null;
        })
        .filter(Boolean);

      if (items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      if (selectedPayment === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          userId: user._id,
          items,
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.msg);
          navigate("/my-order");
          setTimeout(() => setCartItems({}), 500);
        } else {
          toast.error(data.msg);
        }
      } else {
        const loadingToast = toast.loading("Redirecting to checkout...");

        const { data } = await axios.post("/api/order/stripe", {
          userId: user._id,
          items,
          address: selectedAddress._id,
        });

        toast.dismiss(loadingToast);

        if (data.success) {
          toast.success("Redirecting to payment...");
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // UI Starts here
  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() =>
                  navigate(
                    `/product/${product.category.toLowerCase()}/${product._id}`
                  )
                }
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      className="outline-none"
                      value={product.quantity}
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                    >
                      {Array.from(
                        { length: Math.max(cartItems[product._id], 9) },
                        (_, idx) => (
                          <option key={idx} value={idx + 1}>
                            {idx + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="Remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            src={assets.arrow_right_icon_colored}
            alt="Continue Shopping"
            className="group-hover:-translate-x-1 transition"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10">
                {addresses.map((address, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                      selectedAddress === address ? "bg-gray-100" : ""
                    }`}
                  >
                    {address.street}, {address.city}, {address.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {getCartAmount()}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {(getCartAmount() * 0.02).toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {(getCartAmount() * 1.02).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
        >
          {selectedPayment === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl font-medium text-gray-500">Your cart is empty</p>
    </div>
  );
};

export default Cart;
