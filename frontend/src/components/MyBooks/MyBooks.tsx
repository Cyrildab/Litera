import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_BOOKS } from "../../graphql/queries/getUserBooks";
import { DELETE_USER_BOOK } from "../../graphql/mutations/deleteUserBook";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MyBooks.scss";

const STORAGE_KEY = "myBooksOrder";
const ITEMS_PER_PAGE = 7;

const MyBooks = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_BOOKS);
  const [deleteUserBook] = useMutation(DELETE_USER_BOOK, {
    refetchQueries: ["getUserBooks"],
  });

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const books = data?.getUserBooks || [];

  useEffect(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      const currentIds = books.map((b: any) => b.googleBookId);
      setOrder((prevOrder) => {
        const updated = [...prevOrder];
        currentIds.forEach((id: string) => {
          if (!updated.includes(id)) updated.push(id);
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [books]);

  if (loading) return <div className="mybooks__loader">Chargement...</div>;
  if (error) return <div className="mybooks__error">Erreur : {error.message}</div>;

  const handleDelete = async (googleBookId: string) => {
    const confirmDelete = window.confirm("Supprimer ce livre ?");
    if (!confirmDelete) return;

    try {
      await deleteUserBook({ variables: { googleBookId } });
      await refetch();
    } catch (err) {
      console.error("Erreur de suppression :", err);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

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

  const sortedBooks = [...books].sort((a, b) => {
    const indexA = order.indexOf(a.googleBookId);
    const indexB = order.indexOf(b.googleBookId);
    return indexA - indexB;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    const matchesSearch = !searchTerm.trim() || book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    if (window.innerWidth <= 768) {
      const el = document.querySelector(".mybooks__list");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mybooks">
      <h2 className="mybooks__title">📚 Mes livres</h2>

      <div className="homepage__stats">
        {["READ", "IN_PROGRESS", "TO_READ"].map((status) => (
          <div
            key={status}
            className={`homepage__stat ${statusFilter === status ? "active" : ""}`}
            onClick={() => {
              setStatusFilter((prev) => (prev === status ? null : status));
              setCurrentPage(1);
            }}
          >
            <span className="homepage__number">{books.filter((b: any) => b.status === status).length}</span>
            <span className="homepage__label">{getStatusLabel(status)}</span>
          </div>
        ))}
        {statusFilter && (
          <div
            className="homepage__reset"
            onClick={() => {
              setStatusFilter(null);
              setCurrentPage(1);
            }}
          >
            ✖️ Tout afficher
          </div>
        )}
      </div>

      <div className="mybooks__searchbar-wrapper">
        <input
          className="mybooks__searchbar"
          placeholder="Rechercher un livre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="mybooks__list">
        {paginatedBooks.map((book) => (
          <div key={book.googleBookId} className="mybooks__card">
            <img className="mybooks__cover" src={book.cover || "/placeholder.jpg"} alt={book.title} onClick={() => navigate(`/books/${book.googleBookId}`)} />
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
              <button className="mybooks__delete" onClick={() => handleDelete(book.googleBookId)}>
                <span className="mybooks__delete-icon">X</span>
                <span className="mybooks__delete-label">Supprimer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mybooks__pagination-simple">
          <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
            ◀ Précédent
          </button>
          <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBooks;
