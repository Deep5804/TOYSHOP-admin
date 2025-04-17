

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
//defrgdf
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/orders"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Orders</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/categories"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Categories</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/products"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Products</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/reviews"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Reviews</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/users"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage User</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/feedbacks"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Feedback</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/statistics"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Watch Statistics</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/discount-coupons"}
            className="bg-white flex justify-center align-center px-6 py-10 border shadow-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Coupons</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
