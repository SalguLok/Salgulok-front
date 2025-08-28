import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/home/HomePage";
import MapPage from "./pages/map/MapPage";
import LogPage from "./pages/log/LogPage";
import CommunityPage from "./pages/community/CommunityPage";
import MyPage from "./pages/mypage/MyPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/oauth/kakao",
    element: <KakaoRedirectPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/map",
    element: <MapPage />,
  },
  {
    path: "/log",
    element: <LogPage />,
  },
  { path: "/community", element: <CommunityPage /> },
  { path: "/my", element: <MyPage /> },
]);

export default router;
