import { useNavigate } from "react-router-dom";

export default function HeaderMobile() {
  const navigate = useNavigate();

  return (
    <div className="header--mobile">
      {/* <div className="header__hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div> */}
      <div className="header__logo" onClick={() => navigate("/")}>
        <img src="/favicon.png" />
      </div>

      <h3 className="header--mobile__title">
        Shopping List App
      </h3>
    </div>
  );
}
