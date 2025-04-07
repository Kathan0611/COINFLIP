import React, { useState, useEffect } from "react";
import Confetti from "react-dom-confetti";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: string;
  message: string;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  price,
  message,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (isOpen && price) {
      setShowConfetti(true);

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, price]);

  const handleClose = () => {
    setShowConfetti(false);
    onClose(); // Close the modal
  };

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 50,
    elementCount: 300,
    dragFriction: 0.08,
    duration: 5000,
    stagger: 3,
    width: "10px",
    height: "10px",
    perspective: "1200px",
    colors: ["#f00", "#ff0", "#0f0", "#00f", "#f0f"],
  };

  return (
    <>
      {isOpen && (
        <div className="modal-wrapper">
          {/* Confetti Above Modal */}
          <div className="confetti-container">
            <Confetti active={showConfetti} config={confettiConfig} />
          </div>

          {/* Modal Content */}
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Result</h2>
              <p>{message}</p>
              {price!='0' && <p>You won: ${price}</p>}
              <div className="modal-buttons">
                <button onClick={handleClose} className="result-cancel">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultModal;
