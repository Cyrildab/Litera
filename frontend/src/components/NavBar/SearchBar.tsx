import { useLazyQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../../graphql/queries/searchGoogleBooks";
import { SEARCH_USERS } from "../../graphql/queries/searchUsers";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchResultItem from "./SearchResultItem";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchGoogleBooks] = useLazyQuery(SEARCH_GOOGLE_BOOKS);
  const [searchUsers] = useLazyQuery(SEARCH_USERS);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSelectedIndex(-1);

    if (value.length > 1) {
      const [booksRes, usersRes] = await Promise.all([
        searchGoogleBooks({ variables: { query: value, maxResults: 30 } }),
        searchUsers({ variables: { query: value } }),
      ]);

      const books = booksRes.data?.searchGoogleBooks?.map((b: any) => ({ ...b, type: "book" })) || [];
      const users = usersRes.data?.searchUsers?.map((u: any) => ({ ...u, type: "user" })) || [];

      setResults([...users, ...books]);
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        const selectedItem = results[selectedIndex];
        if (selectedItem.type === "book") {
          navigate(`/books/${selectedItem.id}`);
        } else if (selectedItem.type === "user") {
          navigate(`/users/${selectedItem.id}`);
        }
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
          placeholder="Livres, utilisateurs ..."
          value={search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="navbar__searchbar"
        />
      </div>

      {results.length > 0 && (
        <div ref={dropdownRef} className="navbar__dropdown">
          {results.map((item, index) => (
            <SearchResultItem
              key={item.id + item.type}
              item={item}
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
