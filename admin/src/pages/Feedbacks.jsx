

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   FaEye,
//   FaSearch,
//   FaReply,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import ReactPaginate from "react-paginate";
// import LoadingSpinner from "../components/LoadingSpinner";

// const Messages = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const messagesPerPage = 10;
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   const notifySuccess = (message) => toast.success(message);
//   const notifyError = (message) => toast.error(message);

//   const fetchMessages = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         "https://toyshop-sooty.vercel.app/api/contact",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
      
//       if (!response.data.success) {
//         toast.error("Failed to fetch messages");
//         return;
//       }
      
//       const sortedMessages = response.data.messages.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       setMessages(sortedMessages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       notifyError("Error fetching messages");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const handleAction = async (messageId, action) => {
//     try {
//       const response = await axios.put(
//         `https://toyshop-sooty.vercel.app/api/contact/${messageId}/action`,
//         { action },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
      
//       if (response.data.success) {
//         notifySuccess(`Message ${action} successfully`);
//         fetchMessages(); // Refresh the list
//       }
//     } catch (error) {
//       console.error(`Error updating action:`, error);
//       notifyError(`Failed to ${action} message`);
//     }
//   };

//   // Filtered messages based on search query
//   const filteredMessages = messages.filter((message) =>
//     ["name", "emailId", "message"].some((key) =>
//       message[key]?.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   // Sort Messages
//   const sortedMessages = [...filteredMessages].sort((a, b) => {
//     if (sortConfig.key) {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];

//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//     }
//     return 0;
//   });

//   const offset = currentPage * messagesPerPage;
//   const currentPageMessages = sortedMessages.slice(
//     offset,
//     offset + messagesPerPage
//   );

//   const handlePageChange = ({ selected }) => setCurrentPage(selected);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   if (isLoading) return <LoadingSpinner />;

//   return (
//     <div className="p-8 bg-gray-100">
//       <div className="w-full mx-auto bg-white shadow-md p-6">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-6">Messages</h1>

//         <div className="relative w-full md:w-1/3 mb-6">
//           <input
//             type="text"
//             placeholder="Search by Name, Email, or Message"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full p-3 pl-10 border rounded-none"
//           />
//           <FaSearch className="absolute top-3 left-3 text-gray-500" />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse bg-white shadow-md">
//             <thead>
//               <tr className="bg-gray-200 text-gray-700">
//                 <th
//                   className="p-3 text-left cursor-pointer"
//                   onClick={() => handleSort("name")}
//                 >
//                   Name
//                   {sortConfig.key === "name" && (
//                     sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
//                   )}
//                 </th>
//                 <th
//                   className="p-3 text-left cursor-pointer"
//                   onClick={() => handleSort("emailId")}
//                 >
//                   Email
//                   {sortConfig.key === "emailId" && (
//                     sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
//                   )}
//                 </th>
//                 <th className="p-3 text-left">Message</th>
//                 <th
//                   className="p-3 text-left cursor-pointer"
//                   onClick={() => handleSort("createdAt")}
//                 >
//                   Date
//                   {sortConfig.key === "createdAt" && (
//                     sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
//                   )}
//                 </th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentPageMessages.length > 0 ? (
//                 currentPageMessages.map((message) => (
//                   <tr key={message._id} className="border-b">
//                     <td className="p-3">{message.name}</td>
//                     <td className="p-3">{message.emailId}</td>
//                     <td className="p-3">
//                       {message.message.length > 40
//                         ? `${message.message.substring(0, 40)}...`
//                         : message.message}
//                     </td>
//                     <td className="p-3">
//                       {new Date(message.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-3">{message.action}</td>
//                     <td className="p-3 text-center flex justify-center gap-2">
//                       <Link to={`/feedback-details/${message._id}`}>
//                         <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 flex items-center">
//                           <FaEye className="mr-2" /> View
//                         </button>
//                       </Link>
//                       {message.action === "pending" && (
//                         <>
//                           <button
//                             onClick={() => handleAction(message._id, "accepted")}
//                             className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 flex items-center"
//                           >
//                             Accept
//                           </button>
//                           <button
//                             onClick={() => handleAction(message._id, "rejected")}
//                             className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 flex items-center"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="text-center text-gray-500 p-3">
//                     No messages found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <ReactPaginate
//           previousLabel={"← Previous"}
//           nextLabel={"Next →"}
//           breakLabel={"..."}
//           breakClassName={"break-me"}
//           pageCount={Math.ceil(filteredMessages.length / messagesPerPage)}
//           marginPagesDisplayed={2}
//           pageRangeDisplayed={3}
//           onPageChange={handlePageChange}
//           containerClassName={"pagination flex justify-center mt-4"}
//           subContainerClassName={"pages pagination"}
//           activeClassName={"active bg-blue-500 text-white"}
//           pageClassName={"px-4 py-2 mx-1 border cursor-pointer"}
//           previousClassName={"px-4 py-2 mx-1 border cursor-pointer"}
//           nextClassName={"px-4 py-2 mx-1 border cursor-pointer"}
//           breakLinkClassName={"px-4 py-2 mx-1 border cursor-pointer"}
//         />
//       </div>
//     </div>
//   );
// };

// export default Messages;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaSearch,
  FaReply,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/LoadingSpinner";

const Messages = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const messagesPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://toyshop-sooty.vercel.app/api/contact",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (!response.data.success) {
        toast.error("Failed to fetch messages");
        return;
      }
      
      const sortedMessages = response.data.messages.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      notifyError("Error fetching messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleAction = async (messageId, action) => {
    try {
      const response = await axios.put(
        `https://toyshop-sooty.vercel.app/api/contact/${messageId}/action`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        notifySuccess(`Message ${action} successfully`);
        fetchMessages(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error updating action:`, error);
      notifyError(`Failed to ${action} message`);
    }
  };

  // Filtered messages based on search query
  const filteredMessages = messages.filter((message) =>
    ["name", "emailId", "message"].some((key) =>
      message[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort Messages
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const offset = currentPage * messagesPerPage;
  const currentPageMessages = sortedMessages.slice(
    offset,
    offset + messagesPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Messages</h1>

        <div className="relative w-full md:w-1/3 mb-6">
          <input
            type="text"
            placeholder="Search by Name, Email, or Message"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border rounded-none"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  {sortConfig.key === "name" && (
                    sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
                  )}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("emailId")}
                >
                  Email
                  {sortConfig.key === "emailId" && (
                    sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
                  )}
                </th>
                <th className="p-3 text-left">Message</th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Date
                  {sortConfig.key === "createdAt" && (
                    sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
                  )}
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageMessages.length > 0 ? (
                currentPageMessages.map((message) => (
                  <tr key={message._id} className="border-b">
                    <td className="p-3">{message.name}</td>
                    <td className="p-3">{message.emailId}</td>
                    <td className="p-3">
                      {message.message.length > 40
                        ? `${message.message.substring(0, 40)}...`
                        : message.message}
                    </td>
                    <td className="p-3">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <Link to={`/feedback-details/${message._id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 flex items-center">
                          <FaEye className="mr-2" /> View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-3">
                    No messages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(filteredMessages.length / messagesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex justify-center mt-4"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active bg-blue-500 text-white"}
          pageClassName={"px-4 py-2 mx-1 border cursor-pointer"}
          previousClassName={"px-4 py-2 mx-1 border cursor-pointer"}
          nextClassName={"px-4 py-2 mx-1 border cursor-pointer"}
          breakLinkClassName={"px-4 py-2 mx-1 border cursor-pointer"}
        />
      </div>
    </div>
  );
};

export default Messages;