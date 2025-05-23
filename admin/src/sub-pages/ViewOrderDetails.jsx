// import { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../context/ShopContext";
// import LoadingSpinner from "../components/LoadingSpinner";
// import NestedDropdown from "../components/NestedDropdown";

// const ViewOrderDetails = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { currency } = useContext(ShopContext);
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const navigate = useNavigate();
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [products, setProducts] = useState([]);

//   const fetchOrder = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${import.meta.env.VITE_APP_API_URL}/api/order/single/${id}`
//       );
//       setOrder(response.data.order);
//       setSelectedStatus(response.data.order.order_status);

//       // Fetch product details
//       const productDetails = await Promise.all(
//         response.data.order.products.map(async (productItem) => {
//           try {
//             const productResponse = await axios.get(
//               `${import.meta.env.VITE_APP_API_URL}/api/product/single/${
//                 productItem.product_id
//               }`
//             );
//             return {
//               ...productResponse.data.product,
//               net_quantity: productItem.net_quantity,
//               quantity: productItem.quantity,
//               price: productItem.price,
//             };
//           } catch (productError) {
//             console.error(
//               `Error fetching product ${productItem.product_id}:`,
//               productError
//             );
//             return {
//               _id: productItem.product_id,
//               name: "Product Not Found",
//               generic_name: "N/A",
//               product_code: "N/A",
//               quantity: productItem.quantity,
//               price: productItem.price,
//             };
//           }
//         })
//       );
//       setProducts(productDetails);
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const handleEditStatus = () => {
//     setShowEditModal(true);
//   };

//   const handleStatusChange = (event) => {
//     setSelectedStatus(event.target.value);
//   };

//   const handleSaveStatus = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.put(
//         `${import.meta.env.VITE_APP_API_URL}/api/order/update-status/${id}`,
//         {
//           order_status: selectedStatus,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (
//         response.data.success === false &&
//         response.data.message === "Unauthorized"
//       ) {
//         toast.error(response.data.message);
//         navigate("/login");
//         return;
//       }
//       setOrder({ ...order, order_status: selectedStatus });
//       setShowEditModal(false);
//       fetchOrder();
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteOrder = () => {
//     setShowDeleteModal(true); // Open delete confirmation modal
//   };

//   const confirmDeleteOrder = async () => {
//     try {
//       setIsLoading(true);
//       await axios.delete(
//         `${import.meta.env.VITE_APP_API_URL}/api/order/remove/${id}`
//       );
//       navigate("/orders");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//     } finally {
//       setShowDeleteModal(false);
//       setIsLoading(false);
//     }
//   };

//   if (!order || isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-6 bg-gray-100">
//       <div className="bg-white p-6 shadow-lg">
//         <div className="flex flex-wrap justify-between border-b-2">
//           <h1 className="text-3xl font-bold mb-3 pb-2">Order Details</h1>
//           <div>
//             <button
//               className="bg-green-500 hover:bg-green-600 text-white mx-2 py-3 px-4"
//               onClick={handleEditStatus}
//             >
//               Edit Order Status
//             </button>
//             <button
//               className="bg-red-500 hover:bg-red-600 text-white mx-2 py-3 px-4"
//               onClick={handleDeleteOrder}
//             >
//               Delete Order
//             </button>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="mb-6 mt-10">
//           <h2 className="text-xl font-bold mb-5 border-b pb-2">
//             Order Summary
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             <div>
//               <strong>Order ID:</strong> {order.order_id}
//             </div>
//             <div>
//               <strong>User ID:</strong> {order.user_id}
//             </div>
//             <div>
//               <strong>Total Amount:</strong> {currency + " " + order.total}
//             </div>
//             <div>
//               <strong>Payment Method:</strong> {order.payment_method}
//             </div>
//             <div>
//               <strong>Order Status:</strong> {order.order_status}
//             </div>
//             <div>
//               <strong>Created At:</strong>{" "}
//               {new Date(order.created_at).toLocaleString()}
//             </div>
//           </div>
//         </div>

//         {/* Delivery Address */}
//         <div className="mb-6 mt-10">
//           <h2 className="text-xl font-bold mb-5 border-b pb-2">
//             Delivery Address
//           </h2>
//           {order.delivery_address.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <strong>Name:</strong> {order.delivery_address[0].first_name}{" "}
//                 {order.delivery_address[0].last_name}
//               </div>
//               <div>
//                 <strong>Email:</strong> {order.delivery_address[0].email}
//               </div>
//               <div>
//                 <strong>Phone:</strong> {order.delivery_address[0].phone}
//               </div>
//               <div>
//                 <strong>Address:</strong> {order.delivery_address[0].address},{" "}
//                 {order.delivery_address[0].city},{" "}
//                 {order.delivery_address[0].state},{" "}
//                 {order.delivery_address[0].country} -{" "}
//                 {order.delivery_address[0].pincode}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Products List */}
//         <div className="mt-10">
//           <h2 className="text-xl font-bold mb-5 border-b pb-2">Products</h2>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-200 text-gray-700">
//                 <th className="p-3 text-left">Product Code</th>
//                 <th className="p-3 text-left">Product Name</th>
//                 <th className="p-3 text-left">Generic Name</th>
//                 <th className="p-3 text-left">Net Quantity</th>
//                 <th className="p-3 text-left">Price</th>
//                 <th className="p-3 text-left">Quantity</th>
//                 <th className="p-3 text-left">Total Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product, index) => (
//                 <tr key={index} className="border-t">
//                   <td className="p-3">{product.product_code}</td>
//                   <td className="p-3">{product.name}</td>
//                   <td className="p-3">{product.generic_name}</td>
//                   <td className="p-3">
//                     {product.net_quantity} {product.dosage_form}/s
//                   </td>
//                   <td className="p-3">{currency + " " + product.price}</td>
//                   <td className="p-3">{product.quantity}</td>
//                   <td className="p-3">
//                     {currency + " " + product.price * product.quantity}
//                   </td>
//                 </tr>
//               ))}
//               <tr className="border-t">
//                 <td colSpan="6" className="p-3 font-semibold text-end">
//                   Sub Total:
//                 </td>
//                 <td className="p-3">{currency + " " + order.sub_total}</td>
//               </tr>
//               <tr className="border-t">
//                 <td colSpan="6" className="p-3 font-semibold text-end">
//                   Delivery Charge:
//                 </td>
//                 <td className="p-3">
//                   {currency + " " + order.delivery_charge}
//                 </td>
//               </tr>
//               <tr className="border-t">
//                 <td colSpan="6" className="p-3 font-semibold text-end">
//                   Total Amount:
//                 </td>
//                 <td className="p-3 font-semibold">
//                   {currency + " " + order.total}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         <div className="mb-6 mt-10">
//           <h2 className="text-xl font-bold mb-5 border-b pb-2">
//             Track Order Status
//           </h2>
//           <div className="w-full px-[12px] mb-[24px]">
//             <ul className="bb-progress m-[-12px] flex flex-wrap justify-center">
//               {order?.status_history && order.status_history.length > 0 ? (
//                 order.status_history.map((history, index) => (
//                   <li
//                     key={index}
//                     className={`w-[calc(20%-24px)] m-[12px] p-[30px] flex flex-col items-center justify-center border-[1px] border-solid border-gray-400 relative max-[991px]:w-[calc(50%-24px)] max-[480px]:w-full ${"active"}`}
//                   >
//                     <span className="number w-[30px] h-[30px] bg-gray-500 text-[#fff] absolute top-[10px] right-[10px] flex items-center justify-center font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]">
//                       {index + 1}
//                     </span>
//                     <span className="title text-center font-Poppins text-[15px] leading-[22px] tracking-[0.03rem] font-normal text-[#000000]">
//                       {history.status}
//                       <br />
//                       {new Date(history.changed_at).toLocaleString()}
//                     </span>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No status history available.</p>
//               )}
//             </ul>
//           </div>
//         </div>
//         <div className="mb-6 mt-10">
//           <h2 className="text-xl font-bold mb-5 border-b pb-2">
//             Payment Details
//           </h2>
//           <div className="w-full px-[12px] mb-[24px]">
//             <NestedDropdown data={order.payment_details} />
//           </div>
//         </div>
//       </div>
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
//           <div className="bg-white p-6 shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Order Status</h2>
//             <select
//               value={selectedStatus}
//               onChange={handleStatusChange}
//               className="w-full p-3 border mb-4 "
//             >
//               <option value="" disabled>
//                 Select Status
//               </option>
//               <option value="Order Placed">Order Placed</option>
//               <option value="Order Processing">Order Processing</option>
//               <option value="Dispatched">Dispatched</option>
//               <option value="Out for Delivery">Out for Delivery</option>
//               <option value="Order Delivered">Delivered</option>
//               <option value="Order Cancelled">Order Cancelled</option>
//               <option value="Return Request">Return Request Confirmed</option>
//               <option value="Returned">Returned</option>
//             </select>
//             <div className="flex justify-end gap-4">
//               <button
//                 className="bg-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-400 transition"
//                 onClick={() => setShowEditModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-400 text-white py-2 px-6 hover:bg-blue-500 transition"
//                 onClick={handleSaveStatus}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
//           <div className="bg-white p-6 shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//             <div className="mb-4 text-center">
//               <span className="block mb-3">
//                 Are you sure you want to delete order{" "}
//               </span>
//               <span className="font-semibold mb-5">
//                 Oder ID: {order.order_id}?
//               </span>
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 className="bg-gray-300 text-gray-700 py-3 px-4 hover:bg-gray-400 transition"
//                 onClick={() => setShowDeleteModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-red-500 text-white py-3 px-4 hover:bg-red-600 transition"
//                 onClick={confirmDeleteOrder}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewOrderDetails;

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";
import NestedDropdown from "../components/NestedDropdown";
import { toast } from "react-toastify";

const ViewOrderDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useContext(ShopContext);
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching order with ID:", id);

      // Fetch order details
      const orderResponse = await axios.get(
        `https://toyshop-sooty.vercel.app/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Order API Response:", orderResponse.data);

      if (!orderResponse.data || Object.keys(orderResponse.data).length === 0) {
        throw new Error("No order data returned from API");
      }

      const orderData = orderResponse.data;
      setOrder(orderData);
      setSelectedStatus(orderData.orderStatus || "Pending");

      // Set products
      setProducts(
        orderData.products && orderData.products.length > 0
          ? orderData.products.map((productItem) => ({
              _id: productItem.productId?._id || "N/A",
              name: productItem.productId?.name || "Unknown Product",
              price: productItem.productId?.price || 0,
              quantity: productItem.quantity || 0,
            }))
          : []
      );

      // Fetch payment details
      try {
        const paymentResponse = await axios.get(
          `https://toyshop-sooty.vercel.app/api/payments/order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Payment API Response:", paymentResponse.data);
        setPaymentDetails(paymentResponse.data || []);
      } catch (paymentError) {
        console.error("Error fetching payment details:", paymentError);
        setPaymentDetails([]);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to fetch order"
      );
      setOrder(null);
      setProducts([]);
      toast.error(error.response?.data?.message || "Failed to fetch order");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleEditStatus = () => {
    setShowEditModal(true);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSaveStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://toyshop-sooty.vercel.app/api/orders/${id}`,
        {
          orderStatus: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrder({ ...order, orderStatus: selectedStatus });
      setShowEditModal(false);
      toast.success("Order status updated successfully");
      fetchOrderDetails();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `https://toyshop-sooty.vercel.app/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Order deleted successfully");
      navigate("/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    } finally {
      setShowDeleteModal(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !order) {
    return (
      <div className="p-6 bg-gray-100">
        <div className="bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-3 pb-2">Order Not Found</h1>
          <p className="text-red-500">{error || "No order data available"}</p>
          <button
            className="mt-4 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <div className="bg-white p-6 shadow-lg">
        <div className="flex flex-wrap justify-between border-b-2">
          <h1 className="text-3xl font-bold mb-3 pb-2">Order Details</h1>
          <div>
            <button
              className="bg-green-500 hover:bg-green-600 text-white mx-2 py-3 px-4"
              onClick={handleEditStatus}
            >
              Edit Order Status
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white mx-2 py-3 px-4"
              onClick={handleDeleteOrder}
            >
              Delete Order
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 mt-10">
          <h2 className="text-xl font-bold mb-5 border-b pb-2">
            Order Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <strong>Order ID:</strong> {order._id || "N/A"}
            </div>
            <div>
              <strong>User ID:</strong> {order.userId?._id || "N/A"}
            </div>
            <div>
              <strong>Total Amount:</strong>{" "}
              {currency + " " + (order.totalAmount || 0)}
            </div>
            <div>
              <strong>Payment Method:</strong>{" "}
              {paymentDetails.length > 0
                ? paymentDetails[0].paymentMethod
                : "N/A"}
            </div>
            <div>
              <strong>Order Status:</strong> {order.orderStatus || "N/A"}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {order.orderDate
                ? new Date(order.orderDate).toLocaleString()
                : "N/A"}
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-6 mt-10">
          <h2 className="text-xl font-bold mb-5 border-b pb-2">
            Delivery Address
          </h2>
          {order.userId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong>{" "}
                {(order.userId.firstname && order.userId.lastname
                  ? `${order.userId.firstname} ${order.userId.lastname}`
                  : order.userId.name) || "N/A"}
              </div>
              <div>
                <strong>Email:</strong> {order.userId.email || "N/A"}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {order.userId.address
                  ? [
                      order.userId.address,
                      order.userId.city,
                      order.userId.state,
                      order.userId.country,
                      order.userId.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "N/A"
                  : "N/A"}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No address available</p>
          )}
        </div>

        {/* Products List */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-5 border-b pb-2">Products</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{product._id}</td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{currency + " " + product.price}</td>
                    <td className="p-3">{product.quantity}</td>
                    <td className="p-3">
                      {currency + " " + (product.price * product.quantity)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
              <tr className="border-t">
                <td colSpan="4" className="p-3 font-semibold text-end">
                  Sub Total:
                </td>
                <td className="p-3">
                  {currency + " " + (order.totalAmount || 0)}
                </td>
              </tr>
              <tr className="border-t">
                <td colSpan="4" className="p-3 font-semibold text-end">
                  Delivery Charge:
                </td>
                <td className="p-3">{currency + " 0"}</td>
              </tr>
              <tr className="border-t">
                <td colSpan="4" className="p-3 font-semibold text-end">
                  Total Amount:
                </td>
                <td className="p-3 font-semibold">
                  {currency + " " + (order.totalAmount || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Track Order Status */}
        <div className="mb-6 mt-10">
          <h2 className="text-xl font-bold mb-5 border-b pb-2">
            Track Order Status
          </h2>
          <div className="w-full px-[12px] mb-[24px]">
            <ul className="bb-progress m-[-12px] flex flex-wrap justify-center">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((history, index) => (
                  <li
                    key={index}
                    className={`w-[calc(20%-24px)] m-[12px] p-[30px] flex flex-col items-center justify-center border-[1px] border-solid border-gray-400 relative max-[991px]:w-[calc(50%-24px)] max-[480px]:w-full active`}
                  >
                    <span className="number w-[30px] h-[30px] bg-gray-500 text-[#fff] absolute top-[10px] right-[10px] flex items-center justify-center font-Poppins text-[15px] font-light leading-[28px] tracking-[0.03rem]">
                      {index + 1}
                    </span>
                    <span className="title text-center font-Poppins text-[15px] leading-[22px] tracking-[0.03rem] font-normal text-[#000000]">
                      {history.status}
                      <br />
                      {new Date(history.changed_at).toLocaleString()}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No status history available.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-6 mt-10">
          <h2 className="text-xl font-bold mb-5 border-b pb-2">
            Payment Details
          </h2>
          <div className="w-full px-[12px] mb-[24px]">
            {paymentDetails.length > 0 ? (
              <NestedDropdown data={paymentDetails} />
            ) : (
              <p className="text-gray-500">No payment details available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Order Status</h2>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full p-3 border mb-4 "
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Return">Return</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-400 transition"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-400 text-white py-2 px-6 hover:bg-blue-500 transition"
                onClick={handleSaveStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <div className="mb-4 text-center">
              <span className="block mb-3">
                Are you sure you want to delete order{" "}
              </span>
              <span className="font-semibold mb-5">Order ID: {order._id}?</span>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 py-3 px-4 hover:bg-gray-400 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-3 px-4 hover:bg-red-600 transition"
                onClick={confirmDeleteOrder}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrderDetails;