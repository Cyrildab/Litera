import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NavButtons from "./NavButtons";
import "./NavBar.scss";

const Navbar = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__top">
        <div className="navbar__left">
          <Logo />
          <SearchBar />
        </div>
      </div>

      <div className="navbar__bottom">
        <NavButtons user={user} loading={loading} navigate={navigate} />
      </div>
    </nav>
  );
};

export default Navbar;
