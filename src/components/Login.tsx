import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [accessKey, setAccessKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey.length === 12) {
      // In a real app, you'd verify this key on the server
      localStorage.setItem("accessKey", accessKey);
      navigate("/dashboard");
    } else {
      alert("Please enter a valid 12-digit access key");
    }
  };

  return (
    <div className="login-container">
      <h1>Anonymous File Storage</h1>
      <p>Enter your 12-digit access key to log in</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          placeholder="Enter 12-digit key"
          maxLength={12}
          pattern="\d{12}"
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
