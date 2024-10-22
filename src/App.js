import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/auth/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/auth/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
