import React from "react";
import { ToastContainer, Zoom, Bounce, Slide, Flip } from "react-toastify";
import { toast } from "react-toastify";

const PromiseToast = (url = "") => {
  const resolveAfter2Sec = new Promise((resolve, rejecte) =>
    setTimeout(() => {
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((err) => rejecte(err));
    }, 2000)
  );
  toast.promise(resolveAfter2Sec, {
    pending: "Pending",
    success: "Resolved 👌",
    error: "Rejected 🤯",
  });
};

const ToastCon = ({ limit }) => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      limit={limit ? limit : 10}
      pauseOnFocusLoss
      draggable
      pauseOnHove
    />
  );
};

export { ToastCon, PromiseToast };
