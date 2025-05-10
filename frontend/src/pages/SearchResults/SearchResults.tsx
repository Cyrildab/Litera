import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { SEARCH_GOOGLE_BOOKS } from "../../graphql/queries/searchGoogleBooks";
import { SEARCH_USERS } from "../../graphql/queries/searchUsers";
import "./SearchResults.scss";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [filter, setFilter] = useState<"all" | "books" | "users">("all");

  const { data: bookData, loading: bookLoading } = useQuery(SEARCH_GOOGLE_BOOKS, {
    variables: { query },
    skip: !query,
  });

  const { data: userData, loading: userLoading } = useQuery(SEARCH_USERS, {
    variables: { query },
    skip: !query,
  });

  if (bookLoading || userLoading) return <p>Chargement des résultats...</p>;

  const books = bookData?.searchGoogleBooks || [];
  const users = userData?.searchUsers || [];

  const showBooks = filter === "all" || filter === "books";
  const showUsers = filter === "all" || filter === "users";

  return (
    <div className="search-results">
      <h2>Résultats pour "{query}"</h2>

      <div className="search-results__filters">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          Tous
        </button>
        <button className={filter === "books" ? "active" : ""} onClick={() => setFilter("books")}>
          Livres
        </button>
        <button className={filter === "users" ? "active" : ""} onClick={() => setFilter("users")}>
          Utilisateurs
        </button>
      </div>

      <div className="search-results__list">
        {showUsers &&
          users.map((user: any) => (
            <Link to={`/users/${user.id}`} key={`user-${user.id}`} className="search-results__item">
              {user.image ? <img src={user.image} alt={user.username} /> : <div className="search-results__initial">{user.username[0].toUpperCase()}</div>}
              <div>
                <h3>👤 {user.username}</h3>
                <p>Utilisateur LitEra</p>
              </div>
            </Link>
          ))}

        {showBooks &&
          books.map((book: any) => (
            <Link to={`/books/${book.id}`} key={`book-${book.id}`} className="search-results__item">
              <img src={book.cover} alt={book.title} />
              <div>
                <h3>📚 {book.title}</h3>
                <p>{book.author}</p>
              </div>
            </Link>
          ))}

        {showBooks && showUsers && books.length === 0 && users.length === 0 && <p>Aucun résultat trouvé.</p>}
        {showBooks && !showUsers && books.length === 0 && <p>Aucun livre trouvé.</p>}
        {showUsers && !showBooks && users.length === 0 && <p>Aucun utilisateur trouvé.</p>}
      </div>
    </div>
  );
};

export default SearchResults;
