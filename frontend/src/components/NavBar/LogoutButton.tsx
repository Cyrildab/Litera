import { LogoutIcon } from "../../utils/iconList";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGOUT_MUTATION } from "../../graphql/mutations/logout";
import { toast } from "react-toastify";

const LogoutButton = ({ navigate }: any) => {
  const [logout] = useMutation(LOGOUT_MUTATION);
  const client = useApolloClient();

  const handleLogout = async () => {
    await logout();
    await client.refetchQueries({ include: ["Me"] });
    toast.success("Déconnecté avec succès!");
    navigate("/");
  };

  return (
    <div className="navbar__logout-icon" onClick={handleLogout}>
      <LogoutIcon />
    </div>
  );
};

export default LogoutButton;
