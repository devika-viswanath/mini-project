import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../public/assets/assets";

const MainBanner = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[400px] lg:h-[400px] bg-gray-50">
      {/* Background Images */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* Overlay Text & Buttons */}
      <div className="absolute inset-0 z-10 flex flex-col items-center md:items-start justify-end md:justify-center pb-14 md:pb-0 px-4 md:pl-18 lg:pl-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15">
          Freshness You Can Trust,<br className="" />
          Savings You Will Love!
        </h1>

        <div className="flex items-center mt-6 font-medium">
          <Link
            to={"/products"}
            className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
          >
            Shop now
            <img
              className="md:hidden transition group-focus:translate-x-1"
              src={assets.white_arrow_icon}
              alt="arrow"
            />
          </Link>
          <Link
            to={"/products"}
            className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
          >
            Explore Deals
            <img
              className="transition group-hover:translate-x-1"
              src={assets.black_arrow_icon}
              alt="arrow"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};


export default MainBanner;
