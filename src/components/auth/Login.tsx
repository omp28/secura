import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { loginKey, message, handleLogin, updateLoginKey } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login to Your Account</h1>
        <input
          type="text"
          placeholder="Mnemonic or Private Key"
          value={loginKey}
          onChange={(e) => updateLoginKey(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>
        {message && <p className="mt-4 text-gray-400">{message}</p>}
        <p className="mt-4 text-gray-400">
          Don't have an account?{" "}
          <Link to="/auth/signup" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
