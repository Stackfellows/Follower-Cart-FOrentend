import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `https://follower-cart-bacend.onrender.com/followerApi/reset-password/${token}`,
        {
          newPassword,
        }
      );
      setMessage(res.data.msg);
      setIsError(false);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to reset password.");
      setIsError(true);
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
        <motion.div
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-2xl backface-hidden"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
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
            {message && (
              <p
                className={`text-center text-sm ${
                  isError ? "text-red-500" : "text-green-500"
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
