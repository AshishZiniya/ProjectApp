import { Toaster as HotToaster } from "react-hot-toast";
import {
  TOAST_DURATION,
  TOAST_SUCCESS_COLOR,
  TOAST_ERROR_COLOR,
  TOAST_DEFAULT_COLOR,
} from "@/constants"; // Import constants

const Toaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      containerClassName=""
      containerStyle={{
        marginTop: "50px",
      }}
      toastOptions={{
        success: {
          duration: TOAST_DURATION,
          style: {
            background: "white",
            color: TOAST_SUCCESS_COLOR,
          },
        },
        error: {
          duration: TOAST_DURATION,
          style: {
            background: "white",
            color: TOAST_ERROR_COLOR,
          },
        },
        duration: TOAST_DURATION,
        className: "",
        style: {
          background: "white",
          color: TOAST_DEFAULT_COLOR,
        },
      }}
    />
  );
};

export default Toaster;
