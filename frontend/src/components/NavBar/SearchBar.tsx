import { useLazyQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../../graphql/queries/searchGoogleBooks";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchResultItem from "./SearchResultItem";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchGoogleBooks] = useLazyQuery(SEARCH_GOOGLE_BOOKS);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedIndex(-1);

    if (value.length > 1) {
      const { data } = await searchGoogleBooks({ variables: { query: value, maxResults: 30 } });
      setResults(data?.searchGoogleBooks || []);
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = Math.min(prev + 1, results.length - 1);
        document.getElementById(`search-item-${next}`)?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        document.getElementById(`search-item-${next}`)?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        const selectedBook = results[selectedIndex];
        navigate(`/books/${selectedBook.id}`);
      } else if (search.trim().length > 1) {
        navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      }
      setSearch("");
      setResults([]);
      setSelectedIndex(-1);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar__search-wrapper">
      <div className="navbar__input-wrapper">
        <span className="navbar__icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Je cherche un livre"
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="navbar__searchbar"
        />
      </div>

      {results.length > 0 && (
        <div ref={dropdownRef} className="navbar__dropdown">
          {results.map((book, index) => (
            <SearchResultItem
              key={book.id}
              book={book}
              index={index}
              selectedIndex={selectedIndex}
              setSearch={setSearch}
              setResults={setResults}
              setSelectedIndex={setSelectedIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
