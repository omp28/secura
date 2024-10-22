import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

const Login = () => {
  const [loginKey, setLoginKey] = useState("");
  const [message, setMessage] = useState("");
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    const storedPublicKey = localStorage.getItem("publicKey");
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
    }
  }, []);

  const isValidPrivateKey = (key) => {
    return /^0x[a-fA-F0-9]{64}$/.test(key);
  };

  const handleLogin = async () => {
    let wallet;

    try {
      try {
        const mnemonic = ethers.Mnemonic.fromPhrase(loginKey);
        wallet = ethers.Wallet.fromMnemonic(mnemonic.phrase);
      } catch (mnemonicError) {
        if (isValidPrivateKey(loginKey)) {
          wallet = new ethers.Wallet(loginKey);
        } else {
          throw new Error("Invalid mnemonic or private key.");
        }
      }

      const storedPublicKey = wallet.address;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          publicKey: storedPublicKey,
        }
      );

      localStorage.setItem("securaToken", response.data.token);

      if (response.status === 200) {
        setMessage("Login successful! Public key: " + storedPublicKey);
      } else {
        setMessage("Login failed: Invalid credentials.");
      }
    } catch (error) {
      setMessage("Error logging in: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login to Your Account</h1>
        <input
          type="text"
          placeholder="Mnemonic or Private Key"
          value={loginKey}
          onChange={(e) => setLoginKey(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>
        {message && <p className="mt-4 text-gray-400">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
