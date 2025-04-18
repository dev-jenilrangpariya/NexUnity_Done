import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  NavLink,
  Route,
  RouterProvider,
  useNavigate,
  useRoutes,
} from "react-router-dom";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectIsAuthenticated,
  selectRole,
  selectUserData,
} from "../reducers/authSlice";

const BackDrop = lazy(() => import("../components/common/BackDrop"));
//dashboard
const DashMaster = lazy(() => import("../layouts/dashboard/DashMaster"));
const DashboardHome = lazy(() => import("../pages/dash/DashboardHome"));
const DashSettings = lazy(() => import("../pages/dash/DashSettings"));
const User = lazy(() => import("../pages/dash/Users"));
const CommunityManagers = lazy(() => import("../pages/dash/CommunityManagers"));
const CommunityPage = lazy(() => import("../pages/dash/CommunityPage"));
const DashCategoriesPage = lazy(() => import("../pages/dash/DashCategoriesPage"));
const DashSingleCommunity = lazy(() => import("../pages/dash/DashSingleCommunity"));
const Roles = lazy(() => import("../pages/dash/Roles"));
const DashEvents = lazy(() => import("../pages/dash/DashEvents"));
const DashJobsPage = lazy(() => import("../pages/dash/DashJobsPage"));

//front
const FrontMaster = lazy(() => import("../layouts/front/FrontMaster"));
const LandingPage = lazy(() => import("../pages/front/LandingPage"));
const AboutUsPage = lazy(() => import("../pages/front/AboutUsPage"));
const AddPostPage = lazy(() => import("../pages/front/AddPostPage"));
const ContactUsPage = lazy(() => import("../pages/front/ContactUsPage"));
const DonationPage = lazy(() => import("../pages/front/DonationPage"));
const EventsPage = lazy(() => import("../pages/front/EventsPage"));
const FrontCommunityPage = lazy(() =>import("../pages/front/FrontCommunityPage"));
const FrontSingleCommunityPage = lazy(() =>import("../pages/front/FrontSingleCommunityPage"));
const FrontSettingPage = lazy(() => import("../pages/front/FrontSettingPage"));
const JobsPage = lazy(() => import("../pages/front/JobsPage"));
const NewsPage = lazy(() => import("../pages/front/NewsPage"));
const ProfilePage = lazy(() => import("../pages/front/ProfilePage"));
const FrontSinglePostPage = lazy(() => import("../pages/front/FrontSinglePostPage"));
const FrontUserspagePage = lazy(() => import("../pages/front/FrontUserspagePage"));
const OtherProfilePage = lazy(() => import("../pages/front/OtherProfilePage"));
const FrontSingleEventPage = lazy(() => import("../pages/front/FrontSingleEventPage"));
const FrontNotification = lazy(() => import("../pages/front/FrontNotification"));

//login
const AuthMaster = lazy(() => import("../layouts/auth/AuthMaster"));
const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

//register
const Register = lazy(() => import("../pages/auth/Register"));

//Notfound page
const NotFoundPage = lazy(() => import("../components/common/NotFoundPage"));

const AuthGaurd = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userData = useSelector(selectUserData);
  if (isAuthenticated && userData.role === 2) {
    return children;
  }
  if (isAuthenticated) {
    return children;
  }
  return <AuthMaster />;
};
const AdminAuthGaurd = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userData = useSelector(selectUserData);
  if (isAuthenticated && userData.role === 1) {
    return children;
  }
  return <AuthMaster />;
};

export default function Router() {
  const routes = useRoutes([
    //login
    {
      path: "/login",
      element: <Login />,
    },
    //register
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },

    //for admin
    {
      path: "/dashboard",
      element: (
        <AdminAuthGaurd>
          <DashMaster />
        </AdminAuthGaurd>
      ),
      children: [
        { path: "", element: <DashboardHome /> },
        { path: "community", element: <CommunityPage /> },
        { path: "community/:communityId", element: <DashSingleCommunity /> },
        { path: "settings", element: <DashSettings /> },
        { path: "users", element: <User /> },
        // { path: "roles", element: <Roles /> },
        // { path: "subadmin", element: <CommunityManagers /> },
        { path: "categories", element: <DashCategoriesPage /> },
        { path: "events", element: <DashEvents /> },
        { path: "jobs", element: <DashJobsPage /> },
      ],
    },
    //for front
    {
      path: "/",
      element: (
        <AuthGaurd>
          <FrontMaster />
        </AuthGaurd>
      ),
      children: [
        { index: true, path: "", element: <LandingPage /> },
        { path: "add-post", element: <AddPostPage /> },
        { path: "community", element: <FrontCommunityPage /> },
        { path: "community/:communityId", element: <FrontSingleCommunityPage /> },
        { path: "posts/:postId", element: <FrontSinglePostPage /> },
        { path: "jobs", element: <JobsPage /> },
        { path: "events", element: <EventsPage /> },
        { path: "events/:eventId", element: <FrontSingleEventPage /> },
        { path: "news", element: <NewsPage /> },
        { path: "contact-us", element: <ContactUsPage /> },
        { path: "about-us", element: <AboutUsPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "dontaion", element: <DonationPage /> },
        { path: "settings", element: <FrontSettingPage /> },
        { path: "users", element: <FrontUserspagePage /> },
        { path: "users/:userId", element: <OtherProfilePage /> },
        { path: "notification", element: <FrontNotification /> },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  //   const routes = createBrowserRouter(
  //     createRoutesFromElements(
  //       <Route
  //         path="/dashboard"
  //         element={
  //           <AuthGaurd>
  //             <DashMaster />
  //           </AuthGaurd>
  //         }
  //       >
  //         <Route path="" element={<DashboardHome />}></Route>
  //         <Route path="settings" element={<DashSettings />}></Route>
  //       </Route>
  //     )
  //   );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Suspense fallback={<Loader />}>{loading ? <Loader /> : routes}</Suspense>
  );
}
