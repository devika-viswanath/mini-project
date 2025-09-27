import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../../public/assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/order/seller");

        if (data.success) {
          setOrders(data.orders || []);
        } else {
          toast.error(data.msg || "Failed to load orders");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axios]);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-500">Loading orders...</p>
        )}

        {/* No Orders Found */}
        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found</p>
        )}

        {/* Orders List */}
        {!loading &&
          orders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col md:items-center md:flex-row justify-between gap-5 p-5 max-w-4xl rounded-md border border-gray-300"
            >
              {/* Order Items */}
              <div className="flex gap-5 max-w-80">
                <img
                  className="w-12 h-12 object-cover"
                  src={assets.box_icon}
                  alt="boxIcon"
                />
                <div>
                  {order?.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <p className="font-medium">
                        {item?.product?.name ?? "Unknown Product"}{" "}
                        <span className="text-primary">
                          x {item?.quantity ?? 0}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="text-sm md:text-base text-black/60">
                <p className="text-black/80">
                  {order?.address?.firstName ?? ""}{" "}
                  {order?.address?.lastName ?? ""}
                </p>
                <p>
                  {order?.address?.street ?? ""},{" "}
                  {order?.address?.city ?? ""}
                </p>
                <p>
                  {order?.address?.state ?? ""},{" "}
                  {order?.address?.zipcode ?? ""},{" "}
                  {order?.address?.country ?? ""}
                </p>
                <p>{order?.address?.phone ?? ""}</p>
              </div>

              {/* Amount */}
              <p className="font-medium text-lg my-auto">
                {currency}
                {order?.amount ?? 0}
              </p>

              {/* Payment Info */}
              <div className="flex flex-col text-sm md:text-base text-black/60">
                <p>Method: {order?.paymentType ?? "N/A"}</p>
                <p>
                  Date:{" "}
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>Payment: {order?.isPaid ? "Paid" : "Pending"}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;
