import axios from "axios";
import { toast } from "react-toastify";

export const authenticate = async (payload) => {
  const BACKEND_URL = process.env.REACT_APP_BE;
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/login`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { success, message, data } = await res.data;

    if (success) {
      toast.success(message);
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      window.location.href = "/";
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const serverErrorMessage = error.response.data.message;
      toast.error(`${serverErrorMessage}`);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("No response from the server. Please try again later.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
