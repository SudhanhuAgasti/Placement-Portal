import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/AppContext";
const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  useEffect(() => {
    if (isAuthorized && user?.role === "Job-Seeker") {
      axios
        .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
          withCredentials: true,
        })
        .then((res) => {
          const hired = res.data.applications.find(
            (app) => app.status === "Selected"
          );
          if (hired) {
            setSelectedJob(hired);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isAuthorized, user]);

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const { id } = useParams();
  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume("");
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  if (selectedJob) {
    return (
      <section className="application hired_section">
        <div className="container hired_container">
          <div className="hired_card">
            <div className="icon_part">
               <div className="check_icon">✓</div>
            </div>
            <h2>Congratulations!</h2>
            <h3>You have already secured a job</h3>
            <div className="hired_details">
              <p><span>Job Title:</span> {selectedJob.jobId?.title}</p>
              <p><span>Company:</span> {selectedJob.employerID?.user?.name || "The Employer"}</p>
              <p><span>Status:</span> <span className="selected_tag">Selected</span></p>
            </div>
            <div className="footer_msg">
                <p>Since you are already hired, you cannot apply for other positions at this moment.</p>
                <button onClick={() => navigateTo("/applications/me")}>View My Applications</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <textarea
            placeholder="CoverLetter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Select Resume
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending Application..." : "Send Application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
