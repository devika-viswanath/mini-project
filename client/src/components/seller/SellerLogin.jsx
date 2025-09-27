import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  return (
    <div>
      <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center text-sm text-gray-600 bg-black/50 z-30">
        <form
          onSubmit={onSubmitHandler}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[384px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
          <p className="text-2xl font-semibold m-auto">
            <span className="text-primary">Seller</span> Login
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              id="email"
              type="email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type here"
              required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              id="password"
              type="password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type here"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerLogin;
