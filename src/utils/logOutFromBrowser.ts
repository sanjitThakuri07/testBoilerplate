import app from "src/constants/app";

const logOutFromBrowser = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.setItem("logout", Date.now().toString());
  window.location.href = app.auth.login;
};

export default logOutFromBrowser;
