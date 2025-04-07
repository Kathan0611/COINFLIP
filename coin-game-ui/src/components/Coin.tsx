import React from "react";

const IMAGE_PATH = process.env.REACT_APP_MEDIA_PATH;

//Coin Props Interface
interface CoinProps {
  isFlipping: boolean;
  flipResult: "head" | "tail" | null;
  animationClass?: string;
  baseRotation: number;
  coinImages: { head: string; tail: string };
}

// Coin Image animation display
const Coin: React.FC<CoinProps> = ({
  isFlipping,
  animationClass,
  baseRotation,
  coinImages,
}) => {
  //Coin style 
  const coinStyle = {
    "--base-rotation": `rotateX(${baseRotation}deg)`,
    "--base-degrees": baseRotation,
  } as React.CSSProperties;



  return (
    // coin display container
    <div className="coin-display">
      <div
        className={`coin ${isFlipping && animationClass ? animationClass : ""}`}
        style={coinStyle}
      >
        <div
          className="side head"
          style={{ backgroundImage: `url(${IMAGE_PATH}/${coinImages.head})` ,
          top: '2%',
          left:'1%',
          transform: 'translate(1%, -5%)',
        }}
        ></div>
        <div
          className="side tail"
          style={{ backgroundImage: `url(${IMAGE_PATH}/${coinImages.tail})`,
         }}
        ></div>
      </div>
    </div>
  );
};

export default Coin;
