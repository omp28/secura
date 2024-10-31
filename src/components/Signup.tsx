import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Signup: React.FC = () => {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const { setIsAuthenticated } = useAuthStore();

  const handleSignup = async (): Promise<void> => {
    const wallet = ethers.Wallet.createRandom();

    const generatedMnemonic = wallet.mnemonic ? wallet.mnemonic.phrase : "";
    const generatedPrivateKey = wallet.privateKey;
    const generatedPublicKey = wallet.address;

    setMnemonic(generatedMnemonic);
    setPublicKey(generatedPublicKey);

    localStorage.setItem("privateKey", generatedPrivateKey);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        publicKey: generatedPublicKey,
      });
      setMessage("Signup successful. Public key saved!");
    } catch (error: any) {
      setMessage(
        "Error during signup: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const handleConfirm = (): void => {
    const savedPrivateKey = localStorage.getItem("privateKey");
    alert(
      `Mnemonic confirmed! Public key: ${publicKey}\nPrivate key: ${savedPrivateKey}`
    );
    setIsAuthenticated(true);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <button
          onClick={handleSignup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
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
