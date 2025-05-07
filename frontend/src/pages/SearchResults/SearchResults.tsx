import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../../graphql/queries/searchGoogleBooks";
import "./SearchResults.scss";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const { data, loading, error } = useQuery(SEARCH_GOOGLE_BOOKS, {
    variables: { query },
    skip: !query,
  });

  if (loading) return <p>Chargement des résultats...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const books = data?.searchGoogleBooks || [];

  return (
    <div className="search-results">
      <h2>Résultats pour "{query}"</h2>
      <div className="search-results__list">
        {books.length === 0 ? (
          <p>Aucun résultat trouvé.</p>
        ) : (
          books.map((book: any) => (
            <Link to={`/books/${book.id}`} key={book.id} className="search-results__item">
              <img src={book.cover} alt={book.title} />
              <div>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
