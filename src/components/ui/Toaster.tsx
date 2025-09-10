import React from "react";
import { Toaster as HotToaster } from "react-hot-toast";

const Toaster: React.FC = () => {
  return (
    <HotToaster
      position="top-right" // You can change the position
      reverseOrder={false}
      gutter={10}
      containerClassName=""
      containerStyle={{
        marginTop: "50px",
      }}
      toastOptions={{
        success: {
          duration: 2000,
          style: {
            background: "white",
            color: "#02993c",
          },
        },
        error: {
          duration: 2000,
          style: {
            background: "white",
            color: "#990202",
          },
        },
        // Default options for all toasts
        duration: 2000,
        className: "",
        style: {
          background: "white",
          color: "yellow",
        },
      }}
    />
  );
};

export default Toaster;
