import { useNavigate } from "react-router-dom";

type Props = {
  item: any;
  index: number;
  selectedIndex: number;
  setSearch: (val: string) => void;
  setResults: (val: any[]) => void;
  setSelectedIndex: (val: number) => void;
};

const SearchResultItem = ({ item, index, selectedIndex, setSearch, setResults, setSelectedIndex }: Props) => {
  const navigate = useNavigate();
  const isSelected = index === selectedIndex;

  const handleClick = () => {
    setSearch("");
    setResults([]);
    setSelectedIndex(-1);
    navigate(item.type === "user" ? `/users/${item.id}` : `/books/${item.id}`);
  };

  return (
    <div id={`search-item-${index}`} className={`navbar__dropdown-item ${isSelected ? "selected" : ""}`} onClick={handleClick}>
      {item.type === "user" ? (
        item.image ? (
          <img src={item.image} alt="avatar" className="navbar__dropdown-cover" />
        ) : (
          <div className="navbar__dropdown-initial">{item.username?.[0]?.toUpperCase() || "?"}</div>
        )
      ) : (
        <img src={item.cover || "/placeholder.jpg"} alt={item.title} className="navbar__dropdown-cover" />
      )}

      <div className="navbar__dropdown-info">
        <span className="navbar__dropdown-title">{item.username || item.title}</span>
        <span className="navbar__dropdown-author">{item.author || (item.type === "user" ? "Utilisateur LitEra" : "")}</span>
      </div>
    </div>
  );
};

export default SearchResultItem;
