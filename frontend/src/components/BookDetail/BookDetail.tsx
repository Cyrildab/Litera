import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { GET_BOOK } from "../../graphql/queries/getBook";
import "./BookDetail.scss";

const BookDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_BOOK, {
    variables: { id: Number(id) },
  });

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const book = data.book;

  const handleMouseEnter = (index: number) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const handleClick = (index: number) => {
    setSelectedRating(index);
  };

  return (
    <div className="bookdetail">
      <img src={book.cover} alt={book.title} className="bookdetail__cover" />
      <div className="bookdetail__container">
        <div className="bookdetail__containertitleranking">
          <h1 className="bookdetail__title">{book.title}</h1>
          <div className="bookdetail__rating">
            {[1, 2, 3, 4, 5].map((index) => {
              const isFilled = hoveredRating ? index <= hoveredRating : selectedRating ? index <= selectedRating : false;
              return (
                <span
                  key={index}
                  className={`star ${isFilled ? "filled" : ""} `}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
                >
                  ★
                </span>
              );
            })}
          </div>
        </div>
        <h2 className="bookdetail__author">{book.author}</h2>
        <h3 className="bookdetail__gender">{book.gender}</h3>
        <p className="bookdetail__description">{book.description}</p>
        <div className="bookdetail__btnenum">
          <button>Lu</button>
          <button>En cours</button>
          <button>Abandonné</button>
          <button>À lire</button>
        </div>
        <button className="bookdetail__criticalbtn" onClick={() => alert("Critiques à venir!")}>
          Voir les critiques (4.38★)
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
