// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { FaReply, FaTrash } from "react-icons/fa";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { toast } from "react-toastify";

// const ViewFeedbackDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [replyModal, setReplyModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [replyMessage, setReplyMessage] = useState("");

//   const notifySuccess = (message) => toast.success(message);
//   const notifyError = (message) => toast.error(message);

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `${import.meta.env.VITE_APP_API_URL}/api/feedback/single/${id}`
//         );
//         setFeedback(response.data.feedback);
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFeedback();
//   }, [id]);

//   // Open reply modal
//   const handleReply = () => {
//     setReplyMessage(""); // Reset reply message
//     setReplyModal(true);
//   };

//   // Open delete confirmation modal
//   const handleDelete = () => {
//     setDeleteModal(true);
//   };

//   // Send reply function
//   const sendReply = () => {
//     if (!replyMessage.trim()) {
//       notifyError("Reply message cannot be empty!");
//       return;
//     }

//     notifySuccess(`Reply sent to ${feedback.email}: \n\n"${replyMessage}"`);
//     setReplyModal(false);
//   };

//   // Delete feedback function
//   const deleteFeedback = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.delete(
//         `${import.meta.env.VITE_APP_API_URL}/api/feedback/delete/${id}`,
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
//       notifySuccess("Feedback deleted successfully!");
//       navigate("/feedbacks"); // Redirect to the feedback list
//     } catch (error) {
//       console.error("Error deleting feedback:", error);
//       notifyError("Failed to delete feedback.");
//     } finally {
//       setDeleteModal(false);
//       setIsLoading(false);
//     }
//   };

//   if (!feedback || isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-8 bg-gray-100 flex justify-center">
//       <div className="w-full max-w-8xl bg-white shadow-md p-6">
//         <h1 className="text-2xl font-semibold mb-4">Feedback Details</h1>
//         <hr className="mb-4" />
//         <div className="p-4">
//           <p className="mb-4">
//             <strong>Name:</strong> {feedback.first_name} {feedback.last_name}
//           </p>
//           <p className="mb-4">
//             <strong>Email:</strong> {feedback.email}
//           </p>
//           <p className="mb-4">
//             <strong>Phone:</strong> {feedback.phone || "N/A"}
//           </p>
//           <p className="mb-4">
//             <strong>Message:</strong> {feedback.feedback}
//           </p>
//           <p className="mb-4">
//             <strong>Date:</strong>{" "}
//             {new Date(feedback.created_at).toLocaleDateString()}
//           </p>

//           <div className="flex gap-4 mt-10">
//             {/* Reply Button */}
//             <button
//               onClick={handleReply}
//               className="bg-blue-400 text-white px-8 py-3 hover:bg-blue-500 flex items-center justify-center"
//             >
//               <FaReply className="mr-2" /> Reply
//             </button>

//             {/* Delete Button */}
//             <button
//               onClick={handleDelete}
//               className="bg-red-400 text-white px-8 py-3 hover:bg-red-500 flex items-center justify-center"
//             >
//               <FaTrash className="mr-2" /> Delete
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reply Modal */}
//       {replyModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
//           <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">
//               Reply to {feedback.first_name} {feedback.last_name}
//             </h2>
//             <p className="text-gray-700 mb-2">
//               <b>Email: </b>
//               {feedback.email}
//             </p>
//             <p className="text-gray-700 mb-4">
//               <b>Message: </b>
//               {feedback.feedback}
//             </p>
//             <textarea
//               value={replyMessage}
//               onChange={(e) => setReplyMessage(e.target.value)}
//               className="w-full p-3 border mb-4"
//               rows="4"
//               placeholder="Type your reply here..."
//             ></textarea>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setReplyModal(false)}
//                 className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={sendReply}
//                 className="bg-green-500 text-white px-4 py-3 hover:bg-green-600"
//               >
//                 Send Reply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
//           <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
//             <p className="text-gray-700 mb-4">
//               Are you sure you want to delete this feedback?
//             </p>
//             <div className="flex justify-end gap-3 mt-10">
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={deleteFeedback}
//                 className="bg-red-400 text-white px-4 py-3 hover:bg-red-500"
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

// export default ViewFeedbackDetail;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { FaReply, FaTrash } from "react-icons/fa";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { toast } from "react-toastify";

// const ViewFeedbackDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [replyModal, setReplyModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [replyMessage, setReplyMessage] = useState("");

//   const notifySuccess = (message) => toast.success(message);
//   const notifyError = (message) => toast.error(message);

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `https://toyshop-sooty.vercel.app/api/contact/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         if (!response.data.success) {
//           throw new Error("Failed to fetch message");
//         }
//         setFeedback(response.data.message); // Assuming the message object is under "message" key
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//         notifyError("Failed to load feedback details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFeedback();
//   }, [id]);

//   // Open reply modal
//   const handleReply = () => {
//     setReplyMessage("");
//     setReplyModal(true);
//   };

//   // Open delete confirmation modal
//   const handleDelete = () => {
//     setDeleteModal(true);
//   };

//   // Send reply function (placeholder - no reply API provided)
//   const sendReply = () => {
//     if (!replyMessage.trim()) {
//       notifyError("Reply message cannot be empty!");
//       return;
//     }

//     notifySuccess(`Reply sent to ${feedback.emailId}: \n\n"${replyMessage}"`);
//     setReplyModal(false);
//   };

//   // Delete feedback function
//   const deleteFeedback = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.delete(
//         `https://toyshop-sooty.vercel.app/api/contact/${id}`, // Assuming DELETE uses ID in URL
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (!response.data.success) {
//         throw new Error("Failed to delete feedback");
//       }
//       notifySuccess("Feedback deleted successfully!");
//       navigate("/messages"); // Redirect to the messages list
//     } catch (error) {
//       console.error("Error deleting feedback:", error);
//       notifyError("Failed to delete feedback.");
//     } finally {
//       setDeleteModal(false);
//       setIsLoading(false);
//     }
//   };

//   if (!feedback || isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="p-8 bg-gray-100 flex justify-center">
//       <div className="w-full max-w-8xl bg-white shadow-md p-6">
//         <h1 className="text-2xl font-semibold mb-4">Feedback Details</h1>
//         <hr className="mb-4" />
//         <div className="p-4">
//           <p className="mb-4">
//             <strong>Name:</strong> {feedback.name}
//           </p>
//           <p className="mb-4">
//             <strong>Email:</strong> {feedback.emailId}
//           </p>
//           <p className="mb-4">
//             <strong>Message:</strong> {feedback.message}
//           </p>
//           <p className="mb-4">
//             <strong>Status:</strong> {feedback.action}
//           </p>
//           <p className="mb-4">
//             <strong>Date:</strong>{" "}
//             {new Date(feedback.createdAt).toLocaleDateString()}
//           </p>

//           <div className="flex gap-4 mt-10">
//             {/* Reply Button */}
//             <button
//               onClick={handleReply}
//               className="bg-blue-400 text-white px-8 py-3 hover:bg-blue-500 flex items-center justify-center"
//             >
//               <FaReply className="mr-2" /> Reply
//             </button>

//             {/* Delete Button */}
//             <button
//               onClick={handleDelete}
//               className="bg-red-400 text-white px-8 py-3 hover:bg-red-500 flex items-center justify-center"
//             >
//               <FaTrash className="mr-2" /> Delete
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Reply Modal */}
//       {replyModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
//           <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">
//               Reply to {feedback.name}
//             </h2>
//             <p className="text-gray-700 mb-2">
//               <b>Email: </b>
//               {feedback.emailId}
//             </p>
//             <p className="text-gray-700 mb-4">
//               <b>Message: </b>
//               {feedback.message}
//             </p>
//             <textarea
//               value={replyMessage}
//               onChange={(e) => setReplyMessage(e.target.value)}
//               className="w-full p-3 border mb-4"
//               rows="4"
//               placeholder="Type your reply here..."
//             ></textarea>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setReplyModal(false)}
//                 className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={sendReply}
//                 className="bg-green-500 text-white px-4 py-3 hover:bg-green-600"
//               >
//                 Send Reply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
//           <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
//             <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
//             <p className="text-gray-700 mb-4">
//               Are you sure you want to delete this feedback?
//             </p>
//             <div className="flex justify-end gap-3 mt-10">
//               <button
//                 onClick={() => setDeleteModal(false)}
//                 className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={deleteFeedback}
//                 className="bg-red-400 text-white px-4 py-3 hover:bg-red-500"
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

// export default ViewFeedbackDetail;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaReply, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const ViewFeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const notifySuccess = (message) => toast.success(message); // Green success toast
  const notifyError = (message) => toast.error(message);     // Red error toast

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://toyshop-sooty.vercel.app/api/contact/${id}`
        );
        console.log("GET response:", response.data);
        if (!response.data.success) {
          throw new Error("Failed to fetch message");
        }
        setFeedback(response.data.message);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        notifyError("Failed to load feedback details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [id]);

  const handleReply = () => {
    setReplyMessage("");
    setReplyModal(true);
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const sendReply = () => {
    if (!replyMessage.trim()) {
      notifyError("Reply message cannot be empty!");
      return;
    }
    notifySuccess(`Reply sent to ${feedback.emailId}: \n\n"${replyMessage}"`);
    setReplyModal(false);
  };

  const deleteFeedback = async () => {
    try {
      setIsLoading(true);
      console.log("Deleting feedback with ID:", id);

      const response = await axios.delete(
        `https://toyshop-sooty.vercel.app/api/contact/${id}`
      );

      console.log("DELETE response:", response.data);
      console.log("DELETE status:", response.status);

      // Check success based on HTTP status or response
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(
          response.data.message || "Failed to delete feedback"
        );
      }

      // Show green success notification
      notifySuccess("Feedback deleted successfully!");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        notifyError(
          `Failed to delete feedback: ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        notifyError("Failed to delete feedback: No response from server");
      } else {
        console.error("Error message:", error.message);
        notifyError(`Failed to delete feedback: ${error.message}`);
      }
    } finally {
      setDeleteModal(false);
      setIsLoading(false);
      if (!isLoading) {
        navigate("/feedbacks"); // Redirect after modal closes
      }
    }
  };

  if (!feedback || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100 flex justify-center">
      <div className="w-full max-w-8xl bg-white shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Feedback Details</h1>
        <hr className="mb-4" />
        <div className="p-4">
          <p className="mb-4">
            <strong>Name:</strong> {feedback.name}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {feedback.emailId}
          </p>
          <p className="mb-4">
            <strong>Message:</strong> {feedback.message}
          </p>
          <p className="mb-4">
            <strong>Status:</strong> {feedback.action}
          </p>
          <p className="mb-4">
            <strong>Date:</strong>{" "}
            {new Date(feedback.createdAt).toLocaleDateString()}
          </p>

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleReply}
              className="bg-blue-400 text-white px-8 py-3 hover:bg-blue-500 flex items-center justify-center"
            >
              <FaReply className="mr-2" /> Reply
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-400 text-white px-8 py-3 hover:bg-red-500 flex items-center justify-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>

      {replyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Reply to {feedback.name}
            </h2>
            <p className="text-gray-700 mb-2">
              <b>Email: </b>
              {feedback.emailId}
            </p>
            <p className="text-gray-700 mb-4">
              <b>Message: </b>
              {feedback.message}
            </p>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full p-3 border mb-4"
              rows="4"
              placeholder="Type your reply here..."
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyModal(false)}
                className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="bg-green-500 text-white px-4 py-3 hover:bg-green-600"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 shadow-lg w-full max-w-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this feedback?
            </p>
            <div className="flex justify-end gap-3 mt-10">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-3 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteFeedback}
                className="bg-red-400 text-white px-4 py-3 hover:bg-red-500"
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

export default ViewFeedbackDetail;