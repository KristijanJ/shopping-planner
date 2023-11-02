import "./header.scss";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import { useAuth } from "../../context/authContext/authContext";

export default function Header() {
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <div className="header-main">
      <div className="header header-container">
        <HeaderMobile />
        <HeaderDesktop />
        <button
          className="btn btn-outline header-container__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
