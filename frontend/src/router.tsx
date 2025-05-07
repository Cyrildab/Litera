// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import BookDetail from "./components/BookDetail/BookDetail";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import MyBooks from "./components/MyBooks/MyBooks";
import SearchResults from "./pages/SearchResults/SearchResults";
import HomePage from "./pages/HomePage/HomePage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "books",
        element: <MyBooks />,
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
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
