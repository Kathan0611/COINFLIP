import React, { useEffect, useState, useRef } from "react";
import "./../style/Game.scss";
import Coin from "./../components/Coin";
import FlipButton from "./../components/FlipButton";
import {
  coinfilpgamepage,
  gameapidata,
  verifyOtpAPI,
} from "../helpers/apiRequest";
import ResultModal from "./../components/ResultModel";
import OTPModal from "../components/OTPModel";
import { gameValidationSchema } from "../validation/gamepage_validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { gameapidata } from "./../helpers/apiRequest";
import { FormData, CoinImages } from "../types/Game.type";
import bgImage from "../assets/3I.png";

// Audio file paths for coin flip sound effects
const AUDIO = `${process.env.REACT_APP_AUDIO_PATH}/${process.env.REACT_APP_AUDIO_NAME}`;
const winAUDIO = `${process.env.REACT_APP_AUDIO_PATH}/${process.env.REACT_WIN_AUDIO}`;
const loseAUDIO = `${process.env.REACT_APP_AUDIO_PATH}/${process.env.REACT_LOSE_AUDIO}`;
const isAuth = `${process.env.REACT_APP_IS_AUTHENTICATED}` === "true";
console.log(isAuth, "shiw");

interface GamePageProps {
  backgroundImage?: string;
}

const CoinFlip: React.FC<GamePageProps> = (backgroundImage) => {
  // State management for game behavior
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipResult, setFlipResult] = useState<"head" | "tail" | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [animationClass, setAnimationClass] = useState<string>("");
  const [baseRotation, setBaseRotation] = useState<number>(0);
  const [showImageErrorModal, setShowImageErrorModal] =
    useState<boolean>(false);
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false); // OTP Modal state
  const [otpDetails, setOtpDetails] = useState<{
    user_name: string;
    mobile_number: string;
  } | null>(null);
  const [storeprediction, setstoreprediction] = useState<"head" | "tail">(
    "head"
  );
  const [coinImages, setCoinImages] = useState<CoinImages>({
    head: "", // Default empty, will be set by API
    tail: "",
  });

  const [pendingGameData, setPendingGameData] = useState<FormData | null>(null);

  const [errorMessage, seterrorMessage] = useState<string>("");
  const [otpMessage, setotpMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  // Form handling using react-hook-form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(gameValidationSchema),
    defaultValues: {
      user_name: "",
      mobile_number: "",
      prediction_value: "head",
    },
  });

  const coinAudio = useRef(new Audio(AUDIO));
  const winsound = useRef(new Audio(winAUDIO));
  const losesound = useRef(new Audio(loseAUDIO));

  const selectedPrediction = watch("prediction_value");

  const handleFlipClick = () => {
    if (isFlipping) return;

    if (!coinImages.head || !coinImages.tail) {
      setShowImageErrorModal(true);
      return; // Prevent opening the input modal
    }

    setShowInputModal(true);
  };

  const startCoinFlip = async (data: FormData, result: "head" | "tail") => {
    // let result: "head" | "tail" | null = null;

    // try {

    //   setIsFlipping(true);
    //   coinAudio.current.play();
    //   setAnimationClass(result === "tail" ? "flipping-tail" : "flipping-head");

    //   // API request to get flip result
    //   const response = await coinfilpgamepage({
    //     user_name: data.user_name,
    //     mobile_number: data.mobile_number,
    //     prediction_value: data.prediction_value,
    //     isAuth: isAuth
    //   });

    //   setShowInputModal(false);

    //   console.log(response.data,"reposne")
    //   // setApiResponse(response.data);

    //   // result = response.data?.data?.flip_result;

    //   // Set flip result at 50% (1.5s)
    //   setTimeout(() => {
    //     // setFlipResult(result);
    //     setBaseRotation(result === "head" ? 3600 : 3780);
    //   }, 1500);

    //   setTimeout(() => {
    //     setIsFlipping(false);
    //     setShowResultModal(true);
    //     if (result === data.prediction_value) {
    //       winsound.current.play();
    //     } else {
    //       losesound.current.play();
    //     }
    //   }, 3000);

    //   reset();
    // } catch (error: any) {
    //   setIsFlipping(false);
    //   seterrorMessage(error?.response?.data?.message);
    //   console.log(error, "error");
    // }
    setIsFlipping(true);
    coinAudio.current.play();
    setAnimationClass(result === "tail" ? "flipping-tail" : "flipping-head");

    setTimeout(() => {
      setBaseRotation(result === "head" ? 3600 : 3780);
    }, 1500);

    setTimeout(() => {
      setIsFlipping(false);
      setShowResultModal(true);
      if (result === data.prediction_value) {
        winsound.current.play();
      } else {
        losesound.current.play();
      }
    }, 3000);

    reset();
  };

  const verifyOtp = async (enteredOtp: string) => {
    if (!otpDetails || !pendingGameData) return;

    try {
      const response = await verifyOtpAPI({
        otp: enteredOtp,
        user_name: otpDetails.user_name,
        mobile_number: otpDetails.mobile_number,
        prediction_value: storeprediction,
      });

      if (response.data.data.isAuthenticated) {
        setShowOtpModal(false);
        setShowInputModal(false);
        setApiResponse(response.data);
        setFlipResult(response.data.data.flip_result);
        startCoinFlip(pendingGameData, response.data.data.flip_result);
      } else {
  
        setotpMessage(response.data.message);
      
      }
    } catch (error: any) {
      seterrorMessage("OTP verification failed.");
      setotpMessage("OTP verification failed.");
    }
  };

  // Handle form submission and API call
  const onSubmit = async (data: FormData) => {

    if (isSubmitting) return;
    setIsSubmitting(true); // Disable the button

    setFlipResult(null);
    seterrorMessage("");
    setAnimationClass("");

    setPendingGameData(data);

    // If user is not authenticated, show OTP modal

    // let result: "head" | "tail" | null = null;

    try {
      // API request to get flip result
      const response = await coinfilpgamepage({
        user_name: data.user_name,
        mobile_number: data.mobile_number,
        prediction_value: data.prediction_value,
        isAuth: isAuth,
      });

      if (response.data?.data?.success === false) {
        seterrorMessage(response.data?.data?.message); // Show message in input modal
        setIsFlipping(false);
        setIsSubmitting(false); // Re-enable the button on error
        return;
      }

      if (!isAuth) {
        setOtpDetails({
          user_name: data.user_name,
          mobile_number: data.mobile_number,
        });
        setstoreprediction(data.prediction_value);
        setShowOtpModal(true);
        setShowInputModal(false);
        setIsSubmitting(false); // Re-enable the button if OTP is required
        return;
      }

      setShowInputModal(false);
      setIsFlipping(true);
      coinAudio.current.play();

      setApiResponse(response.data);

      const result = response.data?.data?.flip_result;
      console.log(result);
      setFlipResult(result);

      // setAnimationClass(result === "tail" ? "flipping-tail" : "flipping-head");

      startCoinFlip(data, result);

      // // Set flip result at 50% (1.5s)
      // setTimeout(() => {
      //   setBaseRotation(result === "head" ? 3600 : 3780);
      // }, 1500);

      // setTimeout(() => {
      //   setIsFlipping(false);
      //   setShowResultModal(true);
      //   if (result === data.prediction_value) {
      //     winsound.current.play();
      //   } else {
      //     losesound.current.play();
      //   }
      // }, 3000);
    } catch (error: any) {
      setIsFlipping(false);
      seterrorMessage(error?.response?.data?.message);
      console.log(error, "error");
      setIsSubmitting(false); // Re-enable the button on error

    }
  };

  // Close result modal
  const closeResultModal = () => {
    setShowResultModal(false);
    setApiResponse(null);
    setFlipResult(null);
    setAnimationClass("");
  };

  //close otp model
    const closeOTPModel=()=>{
      setShowOtpModal(false);
      reset();
    }

  // Close input modal and reset form
  const closeInputModal = () => {
    setShowInputModal(false);
    reset();
  };

  // Fetch coin images from API
  const fetchImages = async () => {
    try {
      const Images = await gameapidata();
      setCoinImages({
        head: Images.data.data.headImage,
        tail: Images.data.data.tailImage,
      });
    } catch (error: any) {
      console.log(error, "Error");
      setShowImageErrorModal(true);
    }
  };

  // Load coin images on component mount
  useEffect(() => {
    fetchImages();
  }, []); // Runs once on mount

  useEffect(() => {
    if (showInputModal || showResultModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showInputModal, showResultModal]);

    console.log(otpMessage,"304")
  return (
    <div
      className="coin-flip-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", // or 'cover' based on your goal
        backgroundPosition: "center",
      }}
    >
      <h2 className="title">Coin Flip Game</h2>
      <Coin
        isFlipping={isFlipping}
        flipResult={flipResult}
        animationClass={animationClass}
        baseRotation={baseRotation}
        coinImages={coinImages}
      />
      <div className="flip">
        <FlipButton onClick={handleFlipClick} disabled={isFlipping} />
      </div>

      {showImageErrorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Error</h2>
            <p>Failed to load coin images. Please try again later.</p>
            <button
              className="modal-button"
              onClick={() => setShowImageErrorModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showInputModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Your Details</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginBottom: "15px" }} className="input-row">
                <label className="label-left">
                  Name
                  <input
                    type="text"
                    {...register("user_name")}
                    className="modal-input"
                    onBlur={() => trigger("user_name")}
                  />
                  {errors.user_name && (
                    <p className="error-message">{errors.user_name.message}</p>
                  )}
                </label>
              </div>
              <div style={{ marginBottom: "15px" }} className="input-row">
                <label className="label-left">
                  Mobile number
                  <input
                    type="number"
                    {...register("mobile_number")}
                    className="modal-input no-spinner"
                    onBlur={() => trigger("mobile_number")}
                    maxLength={10}
                    // style={{
                    //   appearance: "textfield",
                    //   MozAppearance: "textfield",
                    //   WebkitAppearance: "none"
                    // }}
                  />
                  {errors.mobile_number && (
                    <p className="error-message">
                      {errors.mobile_number.message}
                    </p>
                  )}
                </label>
              </div>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="head"
                    checked={selectedPrediction === "head"}
                    {...register("prediction_value")}
                  />
                  Head
                </label>
                <label>
                  <input
                    type="radio"
                    value="tail"
                    checked={selectedPrediction === "tail"}
                    {...register("prediction_value")}
                  />
                  Tail
                </label>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="button-group">
                <button
                  type="button"
                  onClick={closeInputModal}
                  className="modal-button cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="modal-button" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Submit & Play"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/*Result Model */}
      <ResultModal
        isOpen={showResultModal}
        onClose={closeResultModal}
        price={apiResponse?.data?.price}
        message={apiResponse?.data?.message}
      />
      <OTPModal
        isOpen={showOtpModal}
        onClose={closeOTPModel}
        onVerify={verifyOtp}
        errorMessage={otpMessage}
      />
    </div>
  );
};

export default CoinFlip;
