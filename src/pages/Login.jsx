import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../../context/useAppContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setToken, setShowLogin } = useAppContext(); // ✅ FIXED

  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  /* ESC KEY CLOSE */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowLogin(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowLogin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isSignup
        ? "/api/user/register"
        : "/api/user/login";

      const { data } = await axios.post(url, formData);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(isSignup ? "Account Created!" : "Login Successful!");
        setShowLogin(false); // ✅ WORKS NOW
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)} // ✅ OUTSIDE CLICK
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()} // ✅ PREVENT INSIDE CLICK
        className="bg-white w-[400px] rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {isSignup && (
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
            />
          )}

          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary cursor-pointer ml-2 font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
