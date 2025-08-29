import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/home.jsx";
import Subjects from "./pages/Subjects.jsx";
import QuestionGenerator from "./pages/QuestionGenerator.jsx"; // <-- Import your AI generator component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  );

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("userToken", "loggedIn"); // Example token storage
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("userToken", "loggedIn"); // Example token storage
  };

  return (
    <Router>
      <Routes>
        {/* Default root → Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Signup Page */}
        <Route
          path="/signup"
          element={<Signup onSignupSuccess={handleSignupSuccess} />}
        />

        {/* Home Page (only after login) */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />

        {/* Subjects Page (only after login) */}
        <Route
          path="/subjects"
          element={isLoggedIn ? <Subjects /> : <Navigate to="/login" />}
        />

        {/* AI Question Generator Page (only after login) */}
        <Route
          path="/generate-questions"
          element={isLoggedIn ? <QuestionGenerator /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
