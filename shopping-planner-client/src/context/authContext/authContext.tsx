/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useState } from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

interface ShopListUser extends CognitoUser {
  username: string;
}

interface AuthContextDataInterface {
  user: ShopListUser | null;
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  userAttrs: any;
}

interface AuthContextInterface extends AuthContextDataInterface {
  setUserAuth: (userAuth: {
    user: ShopListUser | null;
    isLoggedIn: boolean;
    isFirstLogin: boolean;
    userAttrs: any;
  }) => void;
  authenticateUser: (userPayload: UserPayload) => void;
  changePassword: (newPassword: string) => void;
  logout: () => void;
}

interface UserPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const AuthContext = createContext<AuthContextInterface>({
  user: null,
  isLoggedIn: false,
  isFirstLogin: false,
  userAttrs: {},
  setUserAuth: () => {},
  authenticateUser: () => {},
  changePassword: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const poolData = {
    UserPoolId: import.meta.env.VITE_USER_POOL_ID,
    ClientId: import.meta.env.VITE_APP_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(poolData);
  const user = userPool.getCurrentUser() as ShopListUser;

  const [userAuth, setUserAuth] = useState<AuthContextDataInterface>({
    user: user,
    isLoggedIn: !!user,
    isFirstLogin: false,
    userAttrs: {},
  });

  const authenticateUser = (userPayload: UserPayload) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: userPayload.username,
        Pool: userPool,
      }) as ShopListUser;

      const authDetails = new AuthenticationDetails({
        Username: userPayload.username,
        Password: userPayload.password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log("login successful");
          setUserAuth({
            ...userAuth,
            isFirstLogin: false,
            isLoggedIn: true,
            user: user,
          });
          resolve(result);
        },
        onFailure: (err) => {
          console.log("login failed", err);
          reject(err);
        },
        newPasswordRequired: (userAttrs) => {
          console.log("new user");
          delete userAttrs.email_verified;
          delete userAttrs.email;
          setUserAuth({
            isFirstLogin: true,
            isLoggedIn: true,
            user: user,
            userAttrs,
          });
        },
      });
    });
  };

  const changePassword = (newPassword: string) => {
    return new Promise((resolve, reject) => {
      userAuth.user?.completeNewPasswordChallenge(
        newPassword,
        userAuth.userAttrs,
        {
          onSuccess: (result) => {
            setUserAuth({
              ...userAuth,
              isFirstLogin: false,
              isLoggedIn: true,
            });
            resolve(result);
          },
          onFailure: (err) => {
            console.log("login failed", err);
            reject(err);
          },
        }
      );
    });
  };

  const logout = () => {
    user.signOut();
    setUserAuth({
      isFirstLogin: false,
      isLoggedIn: false,
      user: null,
      userAttrs: {},
    });
  };

  const contextValue: AuthContextInterface = {
    user: userAuth.user,
    isLoggedIn: userAuth.isLoggedIn,
    isFirstLogin: userAuth.isFirstLogin,
    userAttrs: userAuth.userAttrs,
    setUserAuth: (newUserAuth) => {
      setUserAuth(newUserAuth);
    },
    authenticateUser: (userPayload: UserPayload) =>
      authenticateUser(userPayload),
    changePassword: (newPassword: string) => changePassword(newPassword),
    logout: () => logout(),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
