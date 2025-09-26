import { Toaster as HotToaster } from "react-hot-toast";
import { TOAST_DURATION, TOAST_COLORS } from "@/constants"; // Import constants

const Toaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      containerClassName="mt-[50px]"
      toastOptions={{
        success: {
          duration: TOAST_DURATION,
          style: {
            background: "white",
            color: TOAST_COLORS.SUCCESS,
          },
        },
        error: {
          duration: TOAST_DURATION,
          style: {
            background: "white",
            color: TOAST_COLORS.ERROR,
          },
        },
        duration: TOAST_DURATION,
        className: "",
        style: {
          background: "white",
          color: TOAST_COLORS.DEFAULT,
        },
      }}
    />
  );
};

export default Toaster;
