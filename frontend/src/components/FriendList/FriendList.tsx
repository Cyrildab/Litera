import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_FRIEND } from "../../graphql/mutations/removeFriend";
import { GET_FRIENDS } from "../../graphql/queries/getFriends";
import FriendCard from "../FriendCard/FriendCard"; // ⚠️ adapte le chemin si besoin
import "./FriendList.scss";

const FriendList = () => {
  const { data, loading, error } = useQuery(GET_FRIENDS, { fetchPolicy: "network-only" });

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
          <FriendCard key={friend.id} friend={friend} onRemove={() => removeFriend({ variables: { userId: Number(friend.id) } })} />
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
