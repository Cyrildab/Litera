import { useNavigate } from "react-router-dom";

const Profile = ({ username, image }: { username: string; image?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar__profile" onClick={() => navigate("/profile")}>
      <img src={image || "/default-avatar.png"} alt="avatar" className="navbar__avatar" />
      <span className="navbar__username">{username}</span>
    </div>
  );
};

export default Profile;
