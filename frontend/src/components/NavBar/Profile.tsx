import { useNavigate } from "react-router-dom";

const Profile = ({ username, image }: { username: string; image?: string }) => {
  const navigate = useNavigate();
  const displayInitial = !image;

  return (
    <div className="navbar__profile" onClick={() => navigate("/profile")}>
      {displayInitial ? (
        <div className="navbar__avatar--initial">{username.charAt(0).toUpperCase()}</div>
      ) : (
        <img src={image} alt="avatar" className="navbar__avatar" />
      )}
      <span className="navbar__username" title={username}>
        {username}
      </span>
    </div>
  );
};

export default Profile;
