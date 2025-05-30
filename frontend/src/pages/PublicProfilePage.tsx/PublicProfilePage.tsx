import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_PUBLIC_USER } from "../../graphql/queries/getPublicUser";
import { GET_USER_BOOKS_BY_ID } from "../../graphql/queries/getUserBooksById";
import { GET_FRIENDSHIP_WITH_USER } from "../../graphql/queries/getFriendshipWithUser";
import { SEND_FRIEND_REQUEST } from "../../graphql/mutations/sendFriendRequest";
import { ME_QUERY } from "../../graphql/queries/me";
import { useState } from "react";
import "./PublicProfilePage.scss";

const PublicProfilePage = () => {
  const client = useApolloClient();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { data: userData, loading: loadingUser } = useQuery(GET_PUBLIC_USER, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });

  const { data: booksData, loading: loadingBooks } = useQuery(GET_USER_BOOKS_BY_ID, {
    variables: { userId: Number(userId) },
    skip: !userId,
  });

  const { data: friendshipData, refetch: refetchFriendship } = useQuery(GET_FRIENDSHIP_WITH_USER, {
    variables: { userId: Number(userId) },
    skip: !userId,
    fetchPolicy: "network-only",
  });

  const { data: meData } = useQuery(ME_QUERY);
  const currentUserId = meData?.me?.id;

  const [sendFriendRequest, { loading: sending }] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted: () => {
      refetchFriendship();
      client.refetchQueries({ include: ["GetPendingFriendRequestsReceived"] });
    },
  });

  if (loadingUser || loadingBooks) return <p>Chargement...</p>;
  if (!userData?.getUserById) return <p>Utilisateur introuvable.</p>;

  const user = userData.getUserById;
  const books = booksData?.getUserBooksById || [];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "READ":
        return "Lu";
      case "IN_PROGRESS":
        return "En cours";
      case "TO_READ":
        return "À lire";
      case "ABANDONED":
        return "Abandonné";
      default:
        return status;
    }
  };

  const filteredBooks = books.filter((book: any) => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter ? book.rating === ratingFilter : true;
    return matchesSearch && matchesRating;
  });

  const friendship = friendshipData?.getFriendshipWithUser;
  let friendButton = null;
  if (currentUserId && Number(userId) !== currentUserId) {
    if (!friendship) {
      friendButton = (
        <button className="public-profile__add-friend-btn" disabled={sending} onClick={() => sendFriendRequest({ variables: { receiverId: Number(userId) } })}>
          ➕ Ajouter en ami
        </button>
      );
    } else if (friendship.accepted) {
      friendButton = (
        <button className="public-profile__add-friend-btn" disabled>
          Ami ✔
        </button>
      );
    } else {
      const isRequester = friendship?.requester?.id === currentUserId;
      friendButton = (
        <button className="public-profile__add-friend-btn" disabled>
          {isRequester ? "En attente..." : "Souhaite être ami"}
        </button>
      );
    }
  }

  return (
    <div className="public-profile">
      <div className="public-profile__container">
        <div className="public-profile__header">
          {user.image ? (
            <img src={user.image} alt="avatar" className="public-profile__avatar" />
          ) : (
            <div className="public-profile__avatar--initial">{user.username.charAt(0).toUpperCase()}</div>
          )}
          <div className="public-profile__info">
            <h1>{user.username}</h1>
            <p>{user.description || "Aucune description."}</p>
            {friendButton}
          </div>
        </div>

        <div className="public-profile__filters">
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="public-profile__search"
          />
          <div className="public-profile__ratings">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
                className={`public-profile__rating-btn ${ratingFilter === r ? "active" : ""}`}
              >
                {r} ★
              </button>
            ))}
          </div>
        </div>

        <h2>📚 Livres ajoutés</h2>

        {filteredBooks.length === 0 ? (
          <p className="public-profile__no-books">Aucun livre correspondant.</p>
        ) : (
          <div className="public-profile__books">
            {filteredBooks.map((book: any) => (
              <div key={book.googleBookId} className="public-profile__book-card" onClick={() => navigate(`/books/${book.googleBookId}`)}>
                <img src={book.cover || "/placeholder.jpg"} alt={book.title} />
                <div className="public-profile__info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <span className={`public-profile__status public-profile__status--${book.status.toLowerCase()}`}>{getStatusLabel(book.status)}</span>
                  <div className="public-profile__stars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className={`star ${book.rating >= i ? "filled" : ""}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;
