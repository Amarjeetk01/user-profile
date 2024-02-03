import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../configure";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  const handleRegister = async () => {
    setloader(true);
    const enteredUsername = usernameRef.current.value;
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        enteredEmail,
        enteredPassword
      );
      const user = userCredential.user;
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, {
        username: enteredUsername,
        email: enteredEmail,
      });
      await localStorage.setItem(
        "user",
        JSON.stringify({ email: enteredEmail, uid: user.uid })
      );
      setError(null);
      navigate("/");
    } catch (error) {
      const errorMessage = error.message;
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        setError("Email Already Exist");
      } else {
        setError(errorMessage);
      }
    } finally {
      setloader(false);
    }
  };

  return (
    <div className="card mb-3 profile-container" style={{ maxWidth: 540 }}>
      <h2>Signup</h2>

      {loader && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          ref={usernameRef}
        />
      </div>
      <div className="mb-3">
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
      <button className="btn btn-primary auth-btn" onClick={handleRegister}>
        Signup
      </button>
      <p className="mt-3">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
