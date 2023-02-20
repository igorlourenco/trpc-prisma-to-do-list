import { toast } from "react-toastify";

export const successToast = (message: string) =>
  toast(message, {
    hideProgressBar: true,
    autoClose: 2000,
    type: "success",
    position: "bottom-right",
  });

export const errorToast = (message: string) =>
  toast(message, {
    hideProgressBar: true,
    autoClose: 2000,
    type: "error",
    position: "bottom-right",
  });
