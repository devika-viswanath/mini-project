import React, { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Loading = () => {
  const { navigate, setCartItems, fetchUser } = useAppContext();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get("next");

  const hasRun = useRef(false); // prevent multiple runs

  useEffect(() => {
    const handleSuccess = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      setCartItems({});
      await fetchUser();
      toast.success("Payment Successful! Redirecting...");
      setTimeout(() => {
        navigate(`/${nextUrl || "my-order"}`);
      }, 2000);
    };

    handleSuccess();
  }, [navigate, nextUrl]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loading;
