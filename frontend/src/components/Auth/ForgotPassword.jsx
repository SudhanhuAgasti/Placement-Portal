import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineMailOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/password/forgot",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      navigateTo(`/password/reset?email=${email}`);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="authPage">
      <div className="background"></div>
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header">
          <img src="/job-portal.png" alt="logo" />
          <h3>Forgot Password</h3>
          <p>Enter your email to receive a password reset OTP</p>
        </div>
        <form onSubmit={handleForgotPassword}>
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input
                type="email"
                placeholder="[imit@gmail.com]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MdOutlineMailOutline />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>
          <Link to="/login">Back to Login</Link>
        </form>
      </motion.div>
    </section>
  );
};

export default ForgotPassword;
