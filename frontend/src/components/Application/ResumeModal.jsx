import React from "react";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {imageUrl.toLowerCase().endsWith(".pdf") ? (
          <div className="pdf-container">
            <iframe
              src={imageUrl}
              width="100%"
              height="600px"
              title="Resume Viewer"
              frameBorder="0"
            />
            <div className="pdf-fallback">
              <a href={imageUrl} target="_blank" rel="noreferrer">
                View PDF in Full Screen
              </a>
            </div>
          </div>
        ) : (
          <img src={imageUrl} alt="resume" />
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
