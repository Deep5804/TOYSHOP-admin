import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const ViewUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const userResponse = await axios.get(
          `https://toyshop-sooty.vercel.app/api/users/add/${id}`
        );
        setUser(userResponse.data);

        const cartResponse = await axios.get(
          `https://toyshop-sooty.vercel.app/api/cart/${id}`
        );
        setCart(cartResponse.data);
      } catch (error) {
        console.error("Error fetching details:", error);
        toast.error("Failed to fetch details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <p className="text-center text-red-500">User not found</p>;

  // Extract address fields from the user object with blank fallback for missing fields
  const address = {
    first_name: user.firstname || "",
    last_name: user.lastname || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    country: user.country || "",
    state: user.state || "",
    city: user.city || "",
    pincode: user.pincode || "",
    _id: user._id || "",
    name: user.name || "",
    role: user.role || "",
    __v: user.__v || "",
  };

  // Calculate total price from cart items
  const calculateTotalPrice = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-8xl mx-auto bg-white shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
          <Link
            to="/users"
            className="bg-blue-400 text-white px-4 py-3 hover:bg-blue-500 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Users
          </Link>
        </div>

        {/* User Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            User Info
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p>
              <strong>Name:</strong> {user.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {user.role || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Addresses
          </h2>
          <div className="border p-4 mb-4 bg-gray-50 shadow-sm">
            <p>
              <strong>First Name:</strong> {address.first_name}
            </p>
            <p>
              <strong>Last Name:</strong> {address.last_name}
            </p>
            <p>
              <strong>Email:</strong> {address.email}
            </p>
            <p>
              <strong>Phone:</strong> {address.phone}
            </p>
            <p>
              <strong>Address:</strong> {address.address}
            </p>
            <p>
              <strong>Country:</strong> {address.country}
            </p>
            <p>
              <strong>State:</strong> {address.state}
            </p>
            <p>
              <strong>City:</strong> {address.city}
            </p>
            <p>
              <strong>Pincode:</strong> {address.pincode}
            </p>
            <p>
              <strong>_id:</strong> {address._id}
            </p>
            <p>
              <strong>Name:</strong> {address.name}
            </p>
            <p>
              <strong>Role:</strong> {address.role}
            </p>
            <p>
              <strong>__v:</strong> {address.__v}
            </p>
          </div>
        </div>

        {/* Cart Data Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Cart Data
          </h2>
          <table className="w-full border-collapse bg-white shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Net Quantity</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart && cart.items && cart.items.length > 0 ? (
                cart.items.map((item, index) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">Product {index + 1} (No Name)</td>
                    <td className="p-3">N/A</td>
                    <td className="p-3">{item.price || 0}</td>
                    <td className="p-3">{item.quantity || 0}</td>
                    <td className="p-3">
                      {(item.price || 0) * (item.quantity || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-3">
                    No cart data available
                  </td>
                </tr>
              )}
              <tr className="border-b">
                <td className="p-3 font-bold text-right px-10" colSpan="4">
                  Total:
                </td>
                <td className="p-3 font-bold">{calculateTotalPrice()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-8 py-3 hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;