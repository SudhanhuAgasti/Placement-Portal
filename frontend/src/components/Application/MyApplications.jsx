import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (!isAuthorized) {
        navigateTo("/");
        return;
      }
      if (!user) return; // Wait for user to load

      if (user.role === "Employer") {
        axios
          .get("http://localhost:4000/api/v1/application/employer/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get("http://localhost:4000/api/v1/application/jobseeker/getall", {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  }, [isAuthorized, user, navigateTo]);



  const deleteApplication = (id) => {
    try {
      axios
        .delete(`http://localhost:4000/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleStatusUpdate = (id, status) => {
    try {
      axios
        .put(
          `http://localhost:4000/api/v1/application/update/${id}`,
          { status },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success(res.data.message);
          if (status === "Selected") {
            // Remove other applications of the same student if one is selected
            // But since the backend already deleted them, we should probably just refresh or update local state
            // For simplicity, let's just refresh the list if Selected
            window.location.reload(); 
          } else {
            setApplications((prev) =>
              prev.map((app) => (app._id === id ? { ...app, status } : app))
            );
          }
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job-Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length <= 0 ? (
            <>
              {" "}
              <h4>No Applications Found</h4>{" "}
            </>
          ) : (
            applications.map((element) => {
              return (
                <JobSeekerCard
                  element={element}
                  key={element._id}
                  deleteApplication={deleteApplication}
                  openModal={openModal}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Students</h1>
          {applications.length <= 0 ? (
            <>
              <h4>No Applications Found</h4>
            </>
          ) : (
            applications.map((element) => {
              return (
                <EmployerCard
                  element={element}
                  key={element._id}
                  openModal={openModal}
                  handleStatusUpdate={handleStatusUpdate}
                />
              );
            })
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
          <p>
            <span>Status:</span> <span style={{color: element.status === "Selected" ? "green" : element.status === "Rejected" ? "red" : "blue"}}>{element.status || "Pending"}</span>
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="btn_area">
          <button onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      </div>
    </>
  );
};

const EmployerCard = ({ element, openModal, handleStatusUpdate }) => {
  return (
    <>
      <div className="job_seeker_card">
        <div className="detail">
          <p>
            <span>Applied For:</span> {element.jobId?.title || "N/A"}
          </p>
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
          <p>
            <span>Current Status:</span> <span style={{fontWeight: "bold", color: "#2d3436"}}>{element.status || "Pending"}</span>
          </p>
        </div>
        <div className="resume">
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
          />
        </div>
        <div className="status_btns">
             <select 
               defaultValue={element.status} 
               onChange={(e) => handleStatusUpdate(element._id, e.target.value)}
               className="status-select"
               disabled={element.status === "Selected" || element.status === "Rejected"}
             >
               <option value="Pending">Pending</option>
               <option value="Interview Scheduled">Interview Scheduled</option>
               <option value="Selected">Selected</option>
               <option value="Rejected">Rejected</option>
             </select>
             {(element.status === "Selected" || element.status === "Rejected") && (
                <p className="finalized-msg">Decision Finalized</p>
             )}
        </div>
      </div>
    </>
  );
};
