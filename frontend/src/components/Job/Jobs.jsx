import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../context/AppContext";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      setLoading(true);
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {loading ? (
            // Show 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton-job-card" key={i}>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text" style={{ width: "40%" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "30%" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "20%", height: "25px", marginTop: "10px" }}></div>
              </div>
            ))
          ) : (
            jobs.jobs &&
            jobs.jobs.map((element) => {
              return (
                <div className="card" key={element._id}>
                  <p>{element.title}</p>
                  <p>{element.category}</p>
                  <p>{element.country}</p>
                  <Link to={`/job/${element._id}`}>Job Details</Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
