import { Link } from "react-router-dom";

type Props = {
  book: any;
  index: number;
  selectedIndex: number;
  setSearch: (val: string) => void;
  setResults: (val: any[]) => void;
  setSelectedIndex: (val: number) => void;
};

const SearchResultItem = ({ book, index, selectedIndex, setSearch, setResults, setSelectedIndex }: Props) => {
  return (
    <Link
      id={`search-item-${index}`}
      to={`/books/${book.id}`}
      onClick={() => {
        setSearch("");
        setResults([]);
        setSelectedIndex(-1);
      }}
      className={`navbar__dropdown-item ${index === selectedIndex ? "selected" : ""}`}
    >
      <img src={book.cover} alt={book.title} className="navbar__dropdown-cover" />
      <div className="navbar__dropdown-info">
        <span className="navbar__dropdown-title">{book.title}</span>
        <span className="navbar__dropdown-author">{book.author}</span>
      </div>
    </Link>
  );
};

export default SearchResultItem;
