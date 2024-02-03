import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Account from "./pages/Account";
import "./App.css";
import Protected from "./components/Protected";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <Account />
              </Protected>
            }
          />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
