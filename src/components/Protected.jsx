import React from "react";
import { Navigate } from "react-router-dom";
import useFetch from "../hook/useFetch";

const Protected = ({ children }) => {
  const { user, loading } = useFetch();

  if (loading) {
    return <p>Loading...</p>;
  }
  // console.log("protected", user);
  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }

  return children;
};

export default Protected;
