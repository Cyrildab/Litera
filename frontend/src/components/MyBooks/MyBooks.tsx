import { useQuery } from "@apollo/client";
import { GET_USER_BOOKS } from "../../graphql/queries/getUserBooks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MyBooks.scss";

const STORAGE_KEY = "myBooksOrder";

const MyBooks = () => {
  const { data, loading, error } = useQuery(GET_USER_BOOKS);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);
  useEffect(() => {
    if (data?.getUserBooks) {
      const currentIds = data.getUserBooks.map((book: { googleBookId: string }) => book.googleBookId);

      setOrder((prevOrder) => {
        const updatedOrder = [...prevOrder];
        currentIds.forEach((id: string) => {
          if (!updatedOrder.includes(id)) {
            updatedOrder.push(id);
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrder));
        return updatedOrder;
      });
    }
  }, [data]);

  if (loading) return <div className="mybooks__loader">Chargement...</div>;
  if (error) return <div className="mybooks__error">Erreur : {error.message}</div>;

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

  const books = data?.getUserBooks ?? [];

  const sortedBooks = [...books].sort((a, b) => {
    const indexA = order.indexOf(a.googleBookId);
    const indexB = order.indexOf(b.googleBookId);
    return indexA - indexB;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    if (!searchTerm.trim()) return true; 
    return book.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="mybooks">
      <h2 className="mybooks__title">📚 Mes livres</h2>

      <div className="mybooks__searchbar-wrapper">
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mybooks__searchbar"
        />
      </div>

      <div className="mybooks__list">
        {filteredBooks.map((book) => (
          <div key={book.googleBookId} className="mybooks__card" onClick={() => navigate(`/books/${book.googleBookId}`)}>
            <img className="mybooks__cover" src={book.cover || "/placeholder.jpg"} alt={book.title} />
            <div className="mybooks__info">
              <h3 className="mybooks__book-title">{book.title}</h3>
              <p className="mybooks__author">par {book.author}</p>
              <span className={`mybooks__status mybooks__status--${book.status.toLowerCase()}`}>{getStatusLabel(book.status)}</span>
              <div className="mybooks__stars">
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
    </div>
  );
};

export default MyBooks;
