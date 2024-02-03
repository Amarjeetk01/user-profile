import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../configure";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [loader, setloader] = useState(false);

  const handleLogin = async () => {
    setloader(true);
    const userEmail = emailRef.current.value;
    const userPassword = passwordRef.current.value;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      const user = userCredential.user;
      await localStorage.setItem(
        "user",
        JSON.stringify({ email: userEmail, uid: user.uid })
      );
      navigate("/");
    } catch (error) {
      // console.log(error)
      const errorMessage = error.message;
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        setError("Invalid Credential.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setloader(false);
    }
  };

  return (
    <div className="card mb-3 profile-container" style={{ maxWidth: 540 }}>
      <h2>Login</h2>
      {loader && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-3 ">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          ref={emailRef}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          ref={passwordRef}
        />
      </div>
      <button className="btn btn-primary auth-btn" onClick={handleLogin}>
        Login
      </button>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
