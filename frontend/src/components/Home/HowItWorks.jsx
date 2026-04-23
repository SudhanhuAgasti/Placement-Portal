import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <>
      <div className="howitworks">
        <div className="container">
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How We Works
          </motion.h3>
          <motion.div 
            className="banner"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="card" variants={cardVariants}>
              <FaUserPlus />
              <p>Create Account</p>
              <p>
              Ready to take the next step? Create your account now and unlock exclusive benefits!
              </p>
            </motion.div>
            <motion.div className="card" variants={cardVariants}>
              <MdFindInPage />
              <p>Find a Job/Post a Job</p>
              <p>
              Discover your next career opportunity or attract top talent by exploring job listings or posting a job today!
              </p>
            </motion.div>
            <motion.div className="card" variants={cardVariants}>
              <IoMdSend />
              <p>Apply For Job/Recruit Suitable Candidates</p>
              <p>
              "Take the next step in your career or find the perfect candidate by applying for jobs or recruiting suitable candidates now!"
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
