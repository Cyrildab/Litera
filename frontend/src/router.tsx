// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail/BookDetail";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "books",
        element: <BookList />,
      },
      {
        path: "books/:id",
        element: <BookDetail />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);
