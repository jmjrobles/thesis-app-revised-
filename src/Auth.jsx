import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import "./App.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // You can redirect or reset form here
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="gradient-custom">
      <div className="card text-white">
        <div className="card-body p-5 text-center">
          <form onSubmit={handleAuth}>
            <h2 className="fw-bold mb-3 text-uppercase">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <p className="text-white-50 mb-4">
              {isLogin
                ? "Please enter your credentials to login"
                : "Create your account below"}
            </p>

            <div className="form-outline form-white mb-4">
              <input
                type="email"
                id="emailInput"
                className="form-control form-control-lg w-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="form-label" htmlFor="emailInput">
                Email
              </label>
            </div>

            <div className="form-outline form-white mb-4">
              <input
                type="password"
                id="passwordInput"
                className="form-control form-control-lg w-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="form-label" htmlFor="passwordInput">
                Password
              </label>
            </div>

            {error && <div className="alert alert-danger p-2">{error}</div>}

            <button className="btn btn-outline-light btn-lg w-100 mb-3" type="submit">
              {isLogin ? "Login" : "Register"}
            </button>

            <div>
              {isLogin ? (
                <p className="mb-0">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-white-50 fw-bold"
                    style={{ cursor: "pointer" }}
                  >
                    Sign Up
                  </span>
                </p>
              ) : (
                <p className="mb-0">
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-white-50 fw-bold"
                    style={{ cursor: "pointer" }}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
