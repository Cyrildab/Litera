const Profile = ({ username }: { username: string }) => (
  <div className="navbar__profile" onClick={() => alert("Profil disponible plus tard!")}>
    <div className="navbar__avatar">{username.charAt(0).toUpperCase()}</div>
    <span className="navbar__username">{username}</span>
  </div>
);

export default Profile;
