// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login: React.FC = () => {
//   const [accessKey, setAccessKey] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (accessKey.length === 3) {
//       localStorage.setItem("accessKey", accessKey);
//       navigate("/dashboard");
//     } else {
//       alert("Please enter a valid 12-digit access key");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
//           Anonymous File Storage
//         </h2>
//         <p className="text-sm text-center text-gray-500 mb-6">
//           Enter your 12-digit access key to log in
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             value={accessKey}
//             onChange={(e) => setAccessKey(e.target.value)}
//             placeholder="Enter 12-digit key"
//             maxLength={3}
//             pattern="\d{3}"
//             required
//             className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />

//           <button
//             type="submit"
//             className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [accessKey, setAccessKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessKey.length === 3) {
      localStorage.setItem("accessKey", accessKey);
      navigate("/dashboard");
    } else {
      alert("Please enter a valid 12-digit access key");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Anonymous File Storage
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your 12-digit access key to log in
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Enter 12-digit key"
            maxLength={3}
            pattern="\d{3}"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
