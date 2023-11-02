import { useNavigate } from "react-router-dom";

export default function HeaderDesktop() {
  const navigate = useNavigate();

  return (
    <div className="header--desktop">
      <div className="header__logo" onClick={() => navigate("/")}>
        <img src="/favicon.png" />
      </div>
      <h3 className="header--desktop__title">Shopping List App</h3>
    </div>
  );
}
