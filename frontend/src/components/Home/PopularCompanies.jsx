import React from "react";
import { motion } from "framer-motion";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Deloitte",
      location: "Palace Road High Grounds, Bengaluru",
      openPositions: 10,
      logo:"/Deloitte_Logo.png"

    },
    {
      id: 2,
      title: "TCS",
      location: "Salt lake city, Sector 5, Kolkata",
      openPositions: 5,
      logo:"/TCS.png"
    },
    {
      id: 3,
      title: "Accenture",
      location: "Bhoi Nagar, Acharya Vihar Squar, Bhubaneswar",
      openPositions: 20,
      logo:"/accenture.png"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="companies">
      <div className="container">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          TOP COMPANIES
        </motion.h3>
        <motion.div 
          className="banner"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {companies.map((element) => {
            return (
              <motion.div 
                className="card" 
                key={element.id}
                variants={cardVariants}
                whileHover={{ scale: 1.04, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="content">
                  <div className="icon"><img src={element.logo} alt={element.title} /></div>
                  <div className="text">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Open Positions {element.openPositions}</button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default PopularCompanies;
