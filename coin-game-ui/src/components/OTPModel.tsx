import React, { useState, useRef, useEffect } from "react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  errorMessage: string;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onVerify, errorMessage }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // Track button state
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset OTP and error when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(6).fill(""));
      setError(""); // Clear internal error when modal opens
      setIsVerifying(false); // Reset button state
    }
  }, [isOpen]);

  // Update internal error state when errorMessage prop changes
  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyClick = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    const isVerified = await onVerify(enteredOtp);
    if (!isVerified) {
      setError("Invalid OTP. Please try again.");
      setIsVerifying(false); // Re-enable button if verification fails

    } else {
      onClose(); // Close modal on successful verification
      setError("");
      setIsVerifying(false); // Reset button state

    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter OTP</h2>
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input-box"
            />
          ))}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="button-group">
          <button
            className="modal-button cancel"
            onClick={() => {
              setOtp(new Array(6).fill(""));
              setError(""); // Clear error on cancel
              setIsVerifying(false); // Re-enable button
              onClose();
            }}
          >
            Cancel
          </button>
          <button className="modal-button" onClick={handleVerifyClick} disabled={isVerifying} >
          {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;

