// src/App.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
