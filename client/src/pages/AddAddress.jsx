import React, { useEffect, useState } from "react";
import { assets } from "../../public/assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// InputField Component
export const InputField = ({
  type,
  placeholder,
  name,
  handleChange,
  address,
}) => {
  return (
    <input
      className="w-full border border-gray-300 px-2 py-2.5 rounded outline-none focus:ring-2 focus:border-primary transition text-gray-700"
      type={type}
      placeholder={placeholder}
      name={name}
      onChange={handleChange}
      value={address[name]}
      required
    />
  );
};

// AddAddress Component
const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new address
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      
      const { data } = await axios.post("/api/address/add", {
        address: {
          ...address,
          userId: user._id,
        },
      });

      if (data.success) {
        toast.success(data.msg);
        navigate("/cart");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [navigate, user]);

  // Fetch existing address
  useEffect(() => {
    const getUserAddress = async () => {
      try {
         if (!user || !user._id) return;
        setLoading(true);
        const { data } = await axios.get(`/api/address/get?userId=${user._id}`);
        setLoading(false);

        if (data.success) {
          if (data.addresses && data.addresses.length > 0) {
            const { _id, ...cleanAddress } = data.addresses[0];
            setAddress(cleanAddress);
          }
        } else {
          toast.error(data.msg);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    };

    if (user) {
      getUserAddress();
    }
  }, [axios, user]);

  // Loading state
  if (!user || loading) {
    return <p className="mt-16 text-gray-500 text-center">Loading...</p>;
  }

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping{" "}
        <span className="font-semibold text-primary "> Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="firstName"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="lastName"
                placeholder="Last Name"
              />
            </div>
            <InputField
              handleChange={handleChange}
              type="email"
              address={address}
              name="email"
              placeholder="Email"
            />
            <InputField
              handleChange={handleChange}
              type="text"
              address={address}
              name="street"
              placeholder="Street Address"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="city"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="state"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="zipcode"
                placeholder="Zip Code"
              />
              <InputField
                handleChange={handleChange}
                type="text"
                address={address}
                name="country"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              type="text"
              address={address}
              name="phone"
              placeholder="Phone Number"
            />
            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase rounded">
              Save address
            </button>
          </form>
        </div>
        <img
          src={assets.add_address_iamge}
          alt="add address illustration"
          className="w-full md:w-1/2 mb-10 md:mb-0"
        />
      </div>
    </div>
  );
};

export default AddAddress;
