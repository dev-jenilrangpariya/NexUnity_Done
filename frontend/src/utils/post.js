import axios from "axios";
import { useSelector } from "react-redux";

const user=JSON.parse(sessionStorage.getItem("user"))

export const getAllPost = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BE}/post/get-all-post`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const data = await res.data.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
