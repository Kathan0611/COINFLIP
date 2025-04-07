import React from "react";

//FlipButtonProps Interface
interface FlipButtonProps {
  onClick: () => void;
  disabled: boolean;
}

//Flip button show
const FlipButton: React.FC<FlipButtonProps> = ({ onClick, disabled }) => {
  return (
    <button className="flip-button" onClick={onClick} disabled={disabled}>
      {disabled ? "Flipping..." : "Play"}
    </button>
  );
};
export default FlipButton;
