import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "20",
      subTitle: "Live Job",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "10",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "600",
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "0",
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <div className="heroSection">
        <div className="container">
          <motion.div 
            className="title"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2>Welcome to "SIKSHA"   !!</h2>
            <h1>The Placement Cell Of IMIT</h1>
            <p>
              Find your new placement here. 
              We will support you in your entire placement journey.
            </p>
          </motion.div>
          <motion.div 
            className="image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img src="/home.jpg" alt="hero" />
          </motion.div>
        </div>
        <motion.div 
          className="details"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {details.map((element) => {
            return (
              <motion.div className="card" key={element.id} variants={itemVariants}>
                <div className="icon">{element.icon}</div>
                <div className="content">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};

export default HeroSection;
