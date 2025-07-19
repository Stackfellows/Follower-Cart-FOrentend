import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react"; // Import Mail icon
import { motion, AnimatePresence } from "framer-motion";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for forgot password form
  const [resetEmailSent, setResetEmailSent] = useState(false); // New state for email sent confirmation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    newPassword: "", // New field for reset password (though typically in a separate component)
    confirmNewPassword: "", // New field for reset password confirmation (for a separate component)
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
        const res = await axios.post(
          "https://follower-cart-bacend.onrender.com/followerApi/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        const userData = res.data.loginUser;

        if (userData.isBanned) {
          alert("Your account is banned. Please contact support.");
          setIsLoading(false);
          return;
        }

        onLogin(userData);

        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "user") {
          navigate("/client-dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Signup logic
        await axios.post(
          "https://follower-cart-bacend.onrender.com/followerApi/signup",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            isBanned: false,
          }
        );

        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetEmailSent(false); // Reset email sent status

    try {
      await axios.post(
        "https://follower-cart-bacend.onrender.com/followerApi/forgot-password",
        {
          email: formData.email,
        }
      );
      setResetEmailSent(true);
      alert(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/socailmedia5.jpg')" }}
    >
      <div className="w-full max-w-md perspective">
        <AnimatePresence mode="wait">
          <motion.div
            key={showForgotPassword ? "forgot" : isLogin ? "login" : "signup"}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-2xl backface-hidden"
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              {showForgotPassword
                ? resetEmailSent
                  ? "Password Reset Email Sent"
                  : "Forgot Password"
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </h2>

            {/* Conditional rendering for Forgot Password form */}
            {showForgotPassword ? (
              resetEmailSent ? (
                <div>
                  <p className="text-center text-gray-700">
                    If an account with {formData.email} exists, a password reset
                    link has been sent to your email. Please check your inbox
                    (and spam folder).
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setIsLogin(true);
                      setResetEmailSent(false);
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mt-4"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-center text-sm text-gray-600">
                    Enter your email and we'll send you a link to reset your
                    password.
                  </p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" />
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
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmailSent(false); // Ensure this is reset when going back
                      }}
                      className="text-purple-600 font-medium"
                    >
                      Back to Sign In
                    </button>
                  </p>
                </form>
              )
            ) : (
              // Original Login/Signup Form
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
                <p className="text-center text-sm text-gray-600 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setFormData({ ...formData, email: "" }); // Clear email field for forgot password
                    }}
                    className="text-purple-600 font-medium"
                  >
                    Forgot Password?
                  </button>
                </p>
                <p className="text-center text-sm text-gray-600 mt-4">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-600 font-medium"
                  >
                    {isLogin ? "Sign up" : "Login"}
                  </button>
                </p>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Login;
