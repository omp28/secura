import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import FileUpload from "./components/FileUpload";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Router>
      <div className=" bg-black">
        <Routes>
          <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
          <Route path="/signup" element={<Signup setIsLogin={setIsLogin} />} />
          <Route path="/upload" element={<FileUpload />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
