import { Link } from "react-router-dom";
import Profile from "./Profile";
import LogoutButton from "./LogoutButton";
import NotificationBell from "../NotificationBell/NotificationBell";

const NavButtons = ({ user, loading, navigate }: any) => {
  if (loading) return <span>Chargement...</span>;

  return (
    <div className="navbar__right">
      {user ? (
        <>
          <Profile username={user.username} image={user.image} />
          <NotificationBell />
          <LogoutButton navigate={navigate} />
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Se connecter</button>
          <button onClick={() => navigate("/register")}>Créer un compte</button>
        </>
      )}
    </div>
  );
};

export default NavButtons;
