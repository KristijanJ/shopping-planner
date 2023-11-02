import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./styles/main.scss";

// LAYOUTS
import DefaultLayout from "./layouts/Default/DefaultLayout";

// PAGES
import Home from "./pages/home/Home";
import ErrorPage from "./ErrorPage";
import ShoppingList from "./pages/ShoppingList/ShoppingList";
import Auth from "./pages/Auth/Auth";

// AUTH
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/authContext/authContext";
import { ShoppingProvider } from "./context/shopContext/shopContext";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Auth authType="login" />,
    errorElement: <ErrorPage />,
  },
  // {
  //   path: "/register",
  //   element: <Auth authType="register" />,
  //   errorElement: <ErrorPage />,
  // },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ShoppingProvider>
          <DefaultLayout />
        </ShoppingProvider>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/list/:listId",
        element: <ShoppingList />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
