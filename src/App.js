import React, { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className=" bg-black">
      {isLogin ? (
        <>
          <Login />
          <p className="text-center text-white mt-4">
            Don't have an account?{" "}
            <button className="text-blue-500" onClick={() => setIsLogin(false)}>
              Sign Up
            </button>
          </p>
        </>
      ) : (
        <>
          <Signup />
          <p className="text-center text-white mt-4">
            Already have an account?{" "}
            <button className="text-blue-500" onClick={() => setIsLogin(true)}>
              Log In
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default App;
