import axios from "axios";
const BASE_URL = process.env.REACT_APP_BE;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH_ADMIN = BASE_URL + "/auth";
const AUTH_API_URL = {
  login: path(ROOTS_AUTH_ADMIN, "/login"),
  register: path(ROOTS_AUTH_ADMIN, "/register"),
  userInvitation: path(ROOTS_AUTH_ADMIN, "/user-invitation"),
  forgetpassTokenGenerate: path(ROOTS_AUTH_ADMIN, "/forgetpass-token-generate"),
  updateProfile: path(ROOTS_AUTH_ADMIN, "/update-profile"),
  userActiveStatusUpdate: path(ROOTS_AUTH_ADMIN, "/user-active-status-update"),
  forgetPassword: path(ROOTS_AUTH_ADMIN, "/forget-password"),
  generateOtp: path(ROOTS_AUTH_ADMIN, "/generate_otp"),
  verifyOtp: path(ROOTS_AUTH_ADMIN, "/verify_otp"),
  getAllUser: path(ROOTS_AUTH_ADMIN, "/get-user"),
  resetPassword: path(ROOTS_AUTH_ADMIN, "/reset-password"),
  profileDetails: path(ROOTS_AUTH_ADMIN, "/profile-details/:userId"),
};

const ROOT_COMMUNITY_API = BASE_URL + "/community";
const COMMUNITY_API_URL = {
  getCommunityById: path(ROOT_COMMUNITY_API, "/:id"),
  getAll: path(ROOT_COMMUNITY_API, "/get"),
  create: path(ROOT_COMMUNITY_API, "/create"),
  update: path(ROOT_COMMUNITY_API, "/update"),
  delete: path(ROOT_COMMUNITY_API, "/delete"),
  leftCommmunity: path(ROOT_COMMUNITY_API, "/left_community"),
  joinCommmunity: path(ROOT_COMMUNITY_API, "/join_community"),
  getCommunityCreatedByUser: path(
    ROOT_COMMUNITY_API,
    "/getCommunityCreatedByUser/:id"
  ),
  getUserJoinedCommunity: path(
    ROOT_COMMUNITY_API,
    "/getUserJoinedCommunity/:id"
  ),
};

const ROOT_POST_API = BASE_URL + "/post";
const POST_API_URL = {
  createPost: path(ROOT_POST_API, "/create-post"),
  getPublicPost: path(ROOT_POST_API, "/get-public-post"),
  getPublicAndFollowingPost: path(
    ROOT_POST_API,
    "/get-public-and-following-post"
  ),
  getPersnolPost: path(ROOT_POST_API, "/get-persnol-post"),
  getAllPost: path(ROOT_POST_API, "/get-all-post"),
  getPublicAndFollowingPostByPostId: path(
    ROOT_POST_API,
    "/get-public-and-following-post/:postId"
  ),
  getLikeByPostId: path(ROOT_POST_API, "/get-like/:postId"),
  getAllPostByCid: path(ROOT_POST_API, "/get-all-post/:cid"),
  deletePostById: path(ROOT_POST_API, "/delete-post/:postId"),
};
const LIKE_API_URL = {
  likePost: path(ROOT_POST_API, "/like-post"),
  getLike: path(ROOT_POST_API, "/get-like/:postId"),
};
const COMMENT_API_URL = {
  getPostComment: path(ROOT_POST_API, "/get-comment/:id"),
  addComment: path(ROOT_POST_API, "/add-comment-post"),
  editComment: path(ROOT_POST_API, "/update-comment-post"),
  deleteComment: path(ROOT_POST_API, "/delete-comment-post"),
};

const ROOT_CATEGORY_API = BASE_URL + "/category";
const CATEGORY_API_URL = {
  create: path(ROOT_CATEGORY_API, "/create"),
  get: path(ROOT_CATEGORY_API, "/get"),
  update: path(ROOT_CATEGORY_API, "/update/:id"),
  delete: path(ROOT_CATEGORY_API, "/delete/:id"),
};

const ROOT_EVENT_API = BASE_URL + "/event";
const EVENT_API_URL = {
  create: path(ROOT_EVENT_API, "/create-event"),
  get: path(ROOT_EVENT_API, "/get"),
  update: path(ROOT_EVENT_API, "/update-event"),
  delete: path(ROOT_EVENT_API, "/delete-event/:id"),
  searchEvent: path(ROOT_EVENT_API, "/get?name=/:id"),
};

const ROOT_FOLLOW_API = BASE_URL + "/follow";
const FOLLOW_API_URL = {
  sendRequest: path(ROOT_FOLLOW_API, "/send_request"),
  acceptRequest: path(ROOT_FOLLOW_API, "/accept_request/:follow_id"),
  declineRequest: path(ROOT_FOLLOW_API, "/decline_request/:follow_id"),
  get_pending_request: path(ROOT_FOLLOW_API, "/get_pending_request/:user_id"),
  getUserFollowers: path(ROOT_FOLLOW_API, "/get_followers/:user_id"),
  getUserFollowing: path(ROOT_FOLLOW_API, "/get_following/:user_id"),
  getUserRequsted: path(ROOT_FOLLOW_API, "/get_requested/:user_id"),
};

const ADMIN_DASHBORD_COUNTS = BASE_URL + "/admin-panel/get-all-counts";




const ROOT_JOB_API = BASE_URL + "/job";
const JOB_API_URL = {
  create: path(ROOT_JOB_API, "/create-job"),
  get: path(ROOT_JOB_API, "/get"),
  update: path(ROOT_JOB_API, "/update-job"),
  delete: path(ROOT_JOB_API, "/delete-job/:jobid"),
  apply: path(ROOT_JOB_API, "/applyJob"),
};


export {
  axiosPrivate,
  FOLLOW_API_URL,
  AUTH_API_URL,
  COMMUNITY_API_URL,
  POST_API_URL,
  CATEGORY_API_URL,
  EVENT_API_URL,
  LIKE_API_URL,
  COMMENT_API_URL,
  ADMIN_DASHBORD_COUNTS,
  JOB_API_URL
};
