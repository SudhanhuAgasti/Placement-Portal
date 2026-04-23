import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../context/AppContext";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/verify",
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setUser(data.user);
      setIsAuthorized(true);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/resend-verification",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/job-portal.png" alt="logo" />
            <h3>VERIFY YOUR EMAIL</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="siksha@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Verification Code (OTP)</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleVerify}>
              <span>Verify Account</span>
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button type="button" onClick={handleResend} style={{ background: "none", border: "none", color: "#2d3436", cursor: "pointer", textDecoration: "underline" }}>
                Resend OTP
              </button>
              <Link to={"/login"}>Back to Login</Link>
            </div>
          </form>
        </div>
        <div className="banner">
          <img src="/register.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Verify;
