import React from "react";
import { useEffect } from "react";
import { axiosPrivate } from "./axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectToken } from "../reducers/authSlice";

const useAxiosPrivate = () => {
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // console.log("token in axios >>> ", token);
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (isAuthenticated) {
          config.headers["Authorization"] = `Bearer ${token}`;
          config.headers["authorization"] = `Bearer ${token}`;
          config.headers["Authorization"] = `${token}`;
          config.headers["authorization"] = `${token}`;
          config.headers["session"] = token;
        }

        return config;
      },
      (error) => {
        console.error("Request error >>> ", error);
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (!error.isSHow) {
          if (error.response) {
            error.isSHow = true;
            // The request was made and the server responded with a status code
            if (error.response.data && error.response.data.message) {
              // Server sent a specific error message
              toast.error(error.response.data.message);
            } else {
              // Server did not send a specific error message
              toast.error(`Request failed with status ${error.response.status}`);
            }
          } else if (error.request) {
            // The request was made but no response was received
            toast.error("No response received from the server");
          } else {
            // Something happened in setting up the request
            toast.error("Request setup failed");
          }

        }
        console.log("request intercept >>> ", requestIntercept)
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token, isAuthenticated]);

  return axiosPrivate;
};

export default useAxiosPrivate;
