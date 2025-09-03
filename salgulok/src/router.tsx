import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/home/HomePage";
import MapPage from "./pages/map/MapPage";
import LogPage from "./pages/log/LogPage";
import CommunityPage from "./pages/community/CommunityPage";
import MyPage from "./pages/mypage/MyPage";
import CreateDatePage from "./pages/log/CreateLogDatePage";
import CreateLogInfoPage from "./pages/log/CreateLogInfoPage";
import CreateLogCompletePage from "./pages/log/CreateLogCompletePage";
import CreateRegionPage from "./pages/log/CreateLogRegionPage";

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
  { path: "/log/create/region", element: <CreateRegionPage />},
  { path: "/log/create/date", element: <CreateDatePage /> },
  { path: "/log/create/info", element: <CreateLogInfoPage />},
  { path: "/log/complete", element: <CreateLogCompletePage />}
]);

export default router;
