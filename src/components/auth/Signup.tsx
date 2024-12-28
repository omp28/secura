import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Signup = () => {
  const {
    username,
    mnemonic,
    message,
    isUsernameAvailable,
    hasInvalidChars,
    validateUsername,
    handleSignup,
    handleConfirm,
  } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <input
          type="text"
          placeholder="Enter a unique username"
          value={username}
          onChange={(e) => validateUsername(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full"
        />
        {hasInvalidChars && (
          <p className="text-sm mt-2 text-red-500">
            Usernames cannot contain spaces.
          </p>
        )}
        {isUsernameAvailable !== null && !hasInvalidChars && (
          <p
            className={`text-sm mt-2 ${
              isUsernameAvailable ? "text-green-500" : "text-red-500"
            }`}
          >
            {isUsernameAvailable
              ? "Username is available"
              : "Username is already taken"}
          </p>
        )}
        <button
          onClick={handleSignup}
          disabled={!isUsernameAvailable || hasInvalidChars}
          className={`mt-4 ${
            isUsernameAvailable && !hasInvalidChars
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-500 cursor-not-allowed"
          } text-white font-bold py-2 px-4 rounded w-full`}
        >
          Generate Mnemonic
        </button>

        {mnemonic && (
          <div className="mt-4">
            <h2>Your Mnemonic Phrase:</h2>
            <textarea
              className="bg-gray-700 text-white p-2 rounded w-full h-24"
              value={mnemonic}
              readOnly
            />
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
            >
              Confirm Mnemonic
            </button>
          </div>
        )}
        {message && <p>{message}</p>}

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-500">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
