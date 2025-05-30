import { useQuery, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";

import { GET_GOOGLE_BOOK } from "../../graphql/queries/getGoogleBook";
import { GET_USER_BOOKS } from "../../graphql/queries/getUserBooks";
import { GET_REVIEWS_FOR_BOOK } from "../../graphql/queries/getReviewsForBook";
import { ADD_USER_BOOK } from "../../graphql/mutations/addUserBook";
import { RATE_USER_BOOK } from "../../graphql/mutations/rateUserBook";
import { REVIEW_USER_BOOK } from "../../graphql/mutations/reviewUserBook";

import "./BookDetail.scss";

enum ReadingStatus {
  TO_READ = "TO_READ",
  IN_PROGRESS = "IN_PROGRESS",
  ABANDONED = "ABANDONED",
  READ = "READ",
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: bookData, loading, error } = useQuery(GET_GOOGLE_BOOK, { variables: { id } });
  const { data: userBooksData, refetch: refetchUserBooks } = useQuery(GET_USER_BOOKS);
  const { data: reviewsData, refetch: refetchReviews } = useQuery(GET_REVIEWS_FOR_BOOK, { variables: { googleBookId: id } });

  const [addUserBook] = useMutation(ADD_USER_BOOK);
  const [rateUserBook] = useMutation(RATE_USER_BOOK);
  const [reviewUserBook] = useMutation(REVIEW_USER_BOOK);

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus | null>(null);

  const [review, setReview] = useState<string>("");
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const book = bookData?.getGoogleBook;
  const userBook = userBooksData?.getUserBooks?.find((b: any) => b.googleBookId === book?.id);
  const allReviewsForThisBook = reviewsData?.getAllReviewsForBook || [];
  const otherUsersReviews = allReviewsForThisBook.filter((r: any) => r.user.id !== user?.id && r.review?.trim());

  const ratings = allReviewsForThisBook.map((r: any) => r.rating).filter((r: any) => typeof r === "number");
  const totalRatings = ratings.length;
  const averageRating = ratings.length > 0 ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(2) : null;

  useEffect(() => {
    setSelectedStatus(null);
    setSelectedRating(null);
    setReview("");
    setShowReviewInput(false);
    setIsEditingReview(false);
    refetchUserBooks();
    refetchReviews();
  }, [id, refetchReviews, refetchUserBooks]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#review-")) {
      const timeout = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [reviewsData]);

  useEffect(() => {
    if (book && userBook) {
      setSelectedStatus(userBook.status);
      setSelectedRating(userBook.rating ?? null);
    }
  }, [book, userBook]);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowError(true);
    }, 800); // attend 800 ms avant d'afficher l'erreur

    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <p>Chargement du livre...</p>;
  if ((error || !book) && showError) return <p>Erreur : Livre introuvable.</p>;

  const handleAdd = async (status: ReadingStatus) => {
    try {
      const isAlreadyInLibrary = selectedStatus !== null;
      await addUserBook({ variables: { googleBookId: book.id, status } });
      await refetchUserBooks();
      await refetchReviews();
      setSelectedStatus(status);

      const statusLabels: Record<ReadingStatus, string> = {
        TO_READ: "À lire",
        IN_PROGRESS: "En cours",
        ABANDONED: "Abandonné",
        READ: "Lu",
      };

      toast.success(isAlreadyInLibrary ? `Statut modifié en : ${statusLabels[status]}` : "Ajouté à vos livres !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'ajout.");
    }
  };

  const handleRate = async (rating: number) => {
    try {
      if (!selectedStatus) {
        await handleAdd(ReadingStatus.READ);
      }
      await rateUserBook({ variables: { googleBookId: book.id, rating } });
      await refetchUserBooks();
      await refetchReviews();
      setSelectedRating(rating);
      toast.success(`Note modifiée en : ${rating} ★`);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la modification de la note.");
    }
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) return;
    try {
      await reviewUserBook({ variables: { googleBookId: book.id, review } });
      await refetchUserBooks();
      await refetchReviews();
      toast.success(isEditingReview ? "Critique mise à jour !" : "Critique enregistrée !");
      setShowReviewInput(false);
      setIsEditingReview(false);
      setReview("");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de l'envoi de la critique.");
    }
  };

  return (
    <div className="bookdetail">
      <img src={book.cover} alt={book.title} className="bookdetail__cover" />
      <div className="bookdetail__container">
        <div className="bookdetail__containertitleranking">
          <h1 className="bookdetail__title">{book.title}</h1>
          <div className="bookdetail__rating">
            {[1, 2, 3, 4, 5].map((index) => {
              const isFilled = hoveredRating !== null ? index <= hoveredRating : selectedRating !== null ? index <= selectedRating : false;
              return (
                <span
                  key={index}
                  className={`star ${isFilled ? "filled" : ""}`}
                  onMouseEnter={() => setHoveredRating(index)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => handleRate(index)}
                >
                  ★
                </span>
              );
            })}
          </div>
          {averageRating && (
            <div className="bookdetail__average">
              {averageRating} ★ ({totalRatings} {totalRatings === 1 ? "avis" : "avis"})
            </div>
          )}
        </div>
        <h2 className="bookdetail__author">{book.author}</h2>
        <h3 className="bookdetail__gender">{book.gender}</h3>
        <p className="bookdetail__description">{book.description}</p>

        {user && (
          <>
            <div className="bookdetail__btnenum">
              {Object.values(ReadingStatus).map((status) => (
                <button key={status} className={selectedStatus === status ? "active" : ""} onClick={() => handleAdd(status)}>
                  {status === "TO_READ" ? "À lire" : status === "IN_PROGRESS" ? "En cours" : status === "ABANDONED" ? "Abandonné" : "Lu"}
                </button>
              ))}
            </div>

            {!userBook?.review && !showReviewInput && (
              <button className="bookdetail__criticalbtn" onClick={() => setShowReviewInput(true)}>
                Commenter
              </button>
            )}
          </>
        )}

        {userBook?.review && !isEditingReview && (
          <div className="bookdetail__reviews">
            <h4>
              Ta critique
              <span
                className="bookdetail__editicon"
                onClick={() => {
                  setReview(userBook.review);
                  setIsEditingReview(true);
                  setShowReviewInput(true);
                }}
              >
                ✏️
              </span>
            </h4>
            <div className="bookdetail__reviewcard">
              <div className="bookdetail__user">
                {user?.image ? (
                  <img src={user.image} alt="avatar" className="bookdetail__avatar" />
                ) : (
                  <div className="bookdetail__avatar--initial">{user?.username.charAt(0).toUpperCase()}</div>
                )}
                <strong>{user?.username}</strong>
              </div>
              <p>{userBook.review}</p>
            </div>
          </div>
        )}

        {showReviewInput && (
          <div className="bookdetail__reviewform">
            <textarea className="bookdetail__textarea" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Écris ta critique ici..." />
            <button className="bookdetail__submitbtn" onClick={handleSubmitReview}>
              Valider
            </button>
          </div>
        )}

        {otherUsersReviews.length > 0 && (
          <div className="bookdetail__allreviews">
            <h4>Critiques des autres lecteurs :</h4>
            {otherUsersReviews.map((reviewBook: any) => (
              <div key={reviewBook.id} className="bookdetail__reviewcard" id={`review-${reviewBook.user.id}`}>
                <div className="bookdetail__user" onClick={() => navigate(`/users/${reviewBook.user.id}`)} style={{ cursor: "pointer" }}>
                  {reviewBook.user.image ? (
                    <img src={reviewBook.user.image} alt="avatar" className="bookdetail__avatar" />
                  ) : (
                    <div className="bookdetail__avatar--initial">{reviewBook.user.username.charAt(0).toUpperCase()}</div>
                  )}
                  <strong className="clickable-username">{reviewBook.user.username}</strong>
                </div>
                <p>{reviewBook.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
