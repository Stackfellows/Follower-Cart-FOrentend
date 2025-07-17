import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role for signup is "user" (your client)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const res = await axios.post(
          "http://localhost:5000/followerApi/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        console.log("Login API Response:", res.data); // Backend se aane wala pura data
        const userData = res.data.loginUser;
        console.log("User Data after login:", userData); // loginUser object
        console.log("User role from login:", userData.role); // User ka role

        // Block banned users
        if (userData.isBanned) {
          alert("Your account is banned. Please contact support.");
          setIsLoading(false);
          return;
        }

        onLogin(userData); // App.jsx ko user data pass karein

        if (userData.role === "admin") {
          console.log("Navigating to /admin-dashboard (Admin)");
          navigate("/admin-dashboard");
        } else if (userData.role === "user") {
          // **CHANGED: "client" to "user"**
          console.log("Navigating to /client-dashboard (User/Client)");
          navigate("/client-dashboard");
        } else {
          console.warn("Unknown user role:", userData.role);
          alert("Login successful, but unknown role for navigation.");
          // Fallback to home or specific error page
          navigate("/");
        }
      } else {
        // Signup
        console.log("Attempting Signup with data:", formData);
        await axios.post("http://localhost:5000/followerApi/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role, // "user" or "admin" as selected
          isBanned: false,
        });

        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(
        "Login/Signup Error:",
        err.response?.data?.msg || err.message
      );
      alert(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          )}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {!isLogin && (
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                />
                <span className="ml-1">User</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                <span className="ml-1">Admin</span>
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Signing up..."
              : isLogin
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 font-medium"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
