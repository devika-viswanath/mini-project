import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = React.useState([]);
  const { currency, axios, user } = useAppContext();

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user?._id) return;
      try {
        const { data } = await axios.get("/api/order/user", {
          withCredentials: true,
        });

        if (data.success) {
          
          setMyOrders(data.orders);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      fetchMyOrders();
    }
  }, [axios, user]);

  return (
    <div className="mt-16 pt-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <div>
          {myOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 mb-10 py-5 max-w-4xl"
            >
              <p className="flex justify-between md:items-center text-gray-600 rounded-lg md:font-medium max-md:flex-col">
                <span>OrderId: {order._id}</span>
                <span>Payment : {order.paymentType}</span>
                <span>
                  Total Amount: {currency}
                  {order.amount}
                </span>
              </p>

              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative bg-white text-gray-500/70 ${
                    order.items.length === idx + 1 ? "border-b" : ""
                  } border-gray-300 flex flex-col md:flex-row md:items-center justify-between items-center py-4 px-5 md:gap-16 w-full max-w-4xl rounded-lg`}
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <img
                        src={item?.product?.image?.[0]}
                        alt="item"
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-medium text-gray-800">
                        {item?.product?.name ?? "Unknown product"}
                      </h2>
                      <p>Category: {item?.product?.category ?? "Unknown"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                    <p>Quantity: {item.quantity || "1"}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          order.isPaid ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {order.isPaid ? "Paid" : " Pending"}
                      </span>
                    </p>

                    <p>
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <p className="text-primary text-lg font-medium">
                    Amount: {currency}{(item?.product?.offerPrice ?? 0) * (item?.quantity ?? 1)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
