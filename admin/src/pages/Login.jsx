// import { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import LoadingSpinner from "../components/LoadingSpinner";

// const AdminLogin = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error("Please enter both email and password");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       console.log("Login ", email, password);
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_API_URL}/api/admin/login`,
//         {
//           userid: email,
//           password: password,
//         }
//       );

//       const { success, token, user } = response.data;

//       if (success) {
//         localStorage.setItem("token", token);
//         toast.success("Logged in successfully!");
//         navigate("/dashboard");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       toast.error("Invalid credentials");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div
//       className="flex items-center justify-center bg-gray-100"
//       style={{
//         height: "100vh",
//         width: "100vw",
//         zIndex: 9999,
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//       }}
//     >
//       <div className="bg-white p-8 shadow-lg w-full max-w-md">
//         <h1 className="text-3xl font-semibold mb-6">Admin Login</h1>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email / Username:</label>
//             <input
//               type="text"
//               placeholder="Enter Email or Username"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 border"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700">Password:</label>
//             <input
//               type="password"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 border"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://toyshop-sooty.vercel.app/api/users/login",
        { email, password }
      );

      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (token && user) {
        // ✅ Save token & user to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        login(token); // set context (if needed)
        toast.success("Logged in successfully!");
        navigate("/profile"); // or /dashboard
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid credentials or server error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className="flex items-center justify-center bg-gray-100"
      style={{
        height: "100vh",
        width: "100vw",
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="bg-white p-8 shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6">Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
