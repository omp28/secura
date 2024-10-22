import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import useAuthStore from "./store/useAuthStore";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
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
