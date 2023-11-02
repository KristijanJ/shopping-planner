import {
  Navigate,
  // Link,
  useNavigate,
} from "react-router-dom";
import PageLayout from "../../layouts/PageLayout/PageLayout";
import "./auth.scss";
import { ChangeEvent, useState } from "react";
import { useAuth } from "../../context/authContext/authContext";
import Input from "../../components/Input/Input";

interface Props {
  authType: "login" | "register";
}

export default function Auth(props: Props) {
  const auth = useAuth();
  const [localUser, setLocalUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const title = props.authType === "login" ? "Login" : "Register";
  // const switchLink = props.authType === "login" ? "Register" : "Login";
  const navigate = useNavigate();

  if (auth.isLoggedIn) {
    return <Navigate to="/" />;
  }

  const handleAuthentication = async () => {
    try {
      await auth.authenticateUser(localUser);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await auth.changePassword(localUser.password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalUser({ ...localUser, [e.target.id]: e.target.value });
  };

  return (
    <PageLayout className="auth-page">
      <div className="auth-page__container">
        <h3 className="auth-page__form-text">{title}</h3>

        {auth.isFirstLogin ? (
          <>
            <Input
              id="password"
              label="Password"
              type="password"
              value={localUser.password}
              onInput={handleInput}
            />

            <div className="auth-page__form-element">
              <button onClick={handleChangePassword}>{title}</button>
            </div>
          </>
        ) : (
          <>
            <Input
              id="username"
              label="Username"
              type="text"
              value={localUser.username}
              onInput={handleInput}
            />

            {props.authType === "register" && (
              <Input
                id="email"
                label="Email"
                type="text"
                value={localUser.email}
                onInput={handleInput}
              />
            )}

            <Input
              id="password"
              label="Password"
              type="password"
              value={localUser.password}
              onInput={handleInput}
            />

            {props.authType === "register" && (
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={localUser.confirmPassword}
                onInput={handleInput}
              />
            )}

            <div className="auth-page__form-element">
              <button onClick={handleAuthentication}>{title}</button>
            </div>

            {/* <div className="auth-page__form-text auth-page__form-text--auth-switch">
              Don't have an account?{" "}
              <Link to={`/${switchLink.toLowerCase()}`}>{switchLink}</Link>
            </div> */}
          </>
        )}
      </div>
    </PageLayout>
  );
}
