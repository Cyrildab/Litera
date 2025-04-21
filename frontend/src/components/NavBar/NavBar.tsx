import { useState, useEffect, useRef } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { SEARCH_BOOKS } from "../../graphql/queries/searchBooks";
import { GET_SUGGESTIONS } from "../../graphql/queries/getSuggestions";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";
import "./NavBar.scss";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchBooks] = useLazyQuery(SEARCH_BOOKS);
  const { data: suggestionsData } = useQuery(GET_SUGGESTIONS);
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedIndex(-1);

    if (value.length > 1) {
      const res = await searchBooks({ variables: { query: value } });
      setResults(res.data.searchBooks);
    } else {
      setResults(suggestionsData?.books.slice(0, 5) || []);
    }
  };

  const handleFocus = () => {
    if (search.length < 3 && suggestionsData?.books) {
      setResults(suggestionsData.books.slice(0, 5));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selectedBook = results[selectedIndex];
      navigate(`/books/${selectedBook.id}`);
      setSearch("");
      setSelectedIndex(-1);
      setResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setResults([]);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    toast.info("Profil disponible plus tard !");
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          LITERA
        </Link>

        <div className="navbar__search-wrapper">
          <div className="navbar__input-wrapper">
            <span className="navbar__icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Je cherche un livre"
              value={search}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className="navbar__searchbar"
            />
          </div>
          {results.length > 0 && (
            <div ref={dropdownRef} className="navbar__dropdown">
              {results.map((book: any, index: number) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  onClick={() => {
                    setSearch("");
                    setSelectedIndex(-1);
                    setResults([]);
                  }}
                  className={index === selectedIndex ? "selected" : ""}
                >
                  {book.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar__right">
        <Link to="/books" className="navbar__button">
          Mes livres
        </Link>

        {loading ? (
          <span>Chargement...</span>
        ) : user ? (
          <div className="navbar__profile" onClick={handleProfileClick} title="Accéder au profil">
            <div className="navbar__avatar">{user.username.charAt(0).toUpperCase()}</div>
            <span className="navbar__username">{user.username}</span>
          </div>
        ) : (
          <button onClick={() => navigate("/register")}>Créer un compte</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
