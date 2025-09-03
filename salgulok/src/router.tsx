import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/home/HomePage";
import MapPage from "./pages/map/MapPage";
import LogPage from "./pages/log/LogPage";
import CommunityPage from "./pages/community/CommunityPage";
import MyPage from "./pages/mypage/MyPage";
import SelectDatePage from "./pages/log/SelectDatePage";
import AddLogInfoPage from "./pages/log/AddLogInfoPage";
import AddLogCompletePage from "./pages/log/AddLogCompletePage";
import SelectAreaPage from "./pages/log/SelectRegionPage";

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
  { path: "/log/select-region", element: <SelectAreaPage />},
  { path: "/log/select-date", element: <SelectDatePage /> },
  { path: "/log/add-info", element: <AddLogInfoPage />},
  { path: "/log/add-complete", element: <AddLogCompletePage />}
]);

export default router;
