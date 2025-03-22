import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "../graphql/queries/getBooks";
import { Link } from "react-router-dom";

const BookList = () => {
  const { data, loading, error } = useQuery(GET_BOOKS);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div>
      <h2>📚 Liste des livres</h2>
      {data.books.map((book: any) => (
        <div key={book.id}>
          <h3>
            <Link to={`/book/${book.id}`}>{book.title}</Link>
          </h3>
          <p>Auteur : {book.author}</p>
          <img src={book.cover} alt={book.title} width={150} />
          <p>{book.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BookList;
