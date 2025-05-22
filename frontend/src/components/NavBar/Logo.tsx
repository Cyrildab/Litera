import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="navbar__logo">
    <img src="/logo.png" alt="Logo LitEra" />
  </Link>
);

export default Logo;
