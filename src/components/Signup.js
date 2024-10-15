import React, { useState } from "react";
import { ethers } from "ethers";

const Signup = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const handleSignup = async () => {
    const wallet = ethers.Wallet.createRandom();

    const generatedMnemonic = wallet.mnemonic.phrase;
    const generatedPrivateKey = wallet.privateKey;
    const generatedPublicKey = wallet.address;

    localStorage.setItem("publicKey", generatedPublicKey);

    setMnemonic(generatedMnemonic);
    setPublicKey(generatedPublicKey);
    setPrivateKey(generatedPrivateKey);
  };

  const handleConfirm = () => {
    alert(
      `Mnemonic confirmed! Your public key is: ${publicKey}\nYour private key is: ${privateKey}`
    );
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <p className="mb-6 text-gray-400">
          Generate a mnemonic phrase to secure your account.
        </p>
        <button
          onClick={handleSignup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Generate Mnemonic
        </button>

        {mnemonic && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              Your Mnemonic Phrase:
            </h2>
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
      </div>
    </div>
  );
};

export default Signup;
