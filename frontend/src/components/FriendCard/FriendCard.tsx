import { useQuery } from "@apollo/client";
import { GET_USER_BOOKS_BY_ID } from "../../graphql/queries/getUserBooksById";
import { useNavigate } from "react-router-dom";
import "./FriendCard.scss";

const FriendCard = ({ friend, onRemove }: { friend: any; onRemove: () => void }) => {
  const navigate = useNavigate();

  const { data } = useQuery(GET_USER_BOOKS_BY_ID, {
    variables: { userId: Number(friend.id) },
  });

  const bookCount = data?.getUserBooksById?.length || 0;

  return (
    <li className="friendcard" onClick={() => navigate(`/users/${friend.id}`)}>
      {friend.image ? (
        <img src={friend.image} alt="avatar" className="friendcard__avatar" />
      ) : (
        <div className="friendcard__avatar--initial">{friend.username[0].toUpperCase()}</div>
      )}
      <div className="friendcard__username">{friend.username}</div>
      <div className="friendcard__bookcount">
        {bookCount} livre{bookCount !== 1 ? "s" : ""}
      </div>
      <button
        className="friendcard__remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ❌
      </button>
    </li>
  );
};

export default FriendCard;
