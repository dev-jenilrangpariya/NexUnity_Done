import axios from "axios";
import { useSelector } from "react-redux";

const user = JSON.parse(sessionStorage.getItem("user"));

export const getAllCommunity = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BE}/community/get`, {
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

export const leftCommunity = async (communityId) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BE}/community/left_community`,
      {
        userId: user._id,
        communityId: communityId,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.data.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
