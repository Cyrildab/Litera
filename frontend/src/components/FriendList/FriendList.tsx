import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_FRIEND } from "../../graphql/mutations/removeFriend";
import { GET_FRIENDS } from "../../graphql/queries/getFriends";
import { useNavigate } from "react-router-dom";
import "./FriendList.scss";

const FriendList = () => {
  const { data, loading, error } = useQuery(GET_FRIENDS, { fetchPolicy: "network-only" });
  const navigate = useNavigate();

  const [removeFriend] = useMutation(REMOVE_FRIEND, {
    refetchQueries: ["GetFriends"],
  });

  if (loading) return <p className="friendlist__loader">Chargement des amis...</p>;
  if (error) return <p className="friendlist__error">Erreur : {error.message}</p>;
  if (!data?.getFriends?.length) return <p className="friendlist__empty">Aucun ami trouvé.</p>;

  return (
    <div className="friendlist">
      <h2 className="friendlist__title">👥 Ma liste d'amis</h2>
      <ul className="friendlist__list">
        {data.getFriends.map((friend: any) => (
          <li key={friend.id} className="friendlist__card">
            <div onClick={() => navigate(`/users/${friend.id}`)} style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
              {friend.image ? (
                <img src={friend.image} alt="avatar" className="friendlist__avatar" />
              ) : (
                <div className="friendlist__avatar--initial">{friend.username[0].toUpperCase()}</div>
              )}
              <span className="friendlist__username clickable-username">{friend.username}</span>
            </div>
            <button className="friendlist__remove" onClick={() => removeFriend({ variables: { userId: Number(friend.id) } })} title="Supprimer l'ami">
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
